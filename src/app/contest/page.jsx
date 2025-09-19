"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, BookOpen, Clock, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

const ContestPage = () => {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  
  // New state for instant verdict
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  // Rate limiting state
  const [requestCount, setRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  // Constants
  const MAX_REQUESTS_PER_MINUTE = 3;
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  
  const token = useMemo(() => 
    typeof window !== 'undefined' ? localStorage.getItem('token') || "mock-token-for-dev" : "mock-token-for-dev", 
    []
  );
  
  const API_BASE_URL = "http://localhost:8080/api";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyC9ordkhWuD8B7axV5wYoMswPy9ghOJfbY";

  // Rate limiting helper
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
      setRequestCount(0);
      setRateLimitHit(false);
    }
    
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      setRateLimitHit(true);
      const timeToWait = RATE_LIMIT_WINDOW - (now - lastRequestTime);
      setRetryAfter(Math.ceil(timeToWait / 1000));
      return false;
    }
    
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return false;
    }
    
    return true;
  }, [requestCount, lastRequestTime]);

  const updateRateLimit = useCallback(() => {
    const now = Date.now();
    setRequestCount(prev => prev + 1);
    setLastRequestTime(now);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data.');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      if (questions.length === 0) {
        setTimeout(() => generateQuestions(userData), 500); 
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      setError('Failed to load user profile. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [token, questions.length]);

  const generateQuestions = useCallback(async (userData = user) => {
    if (!userData) {
      setError('User data not available');
      return;
    }

    if (!checkRateLimit()) {
      if (rateLimitHit) {
        setError(`Rate limit exceeded. Please wait ${retryAfter} seconds before generating new questions.`);
        return;
      } else {
        setError('Please wait a moment before generating new questions.');
        return;
      }
    }

    setGeneratingQuestions(true);
    setError(null);
    updateRateLimit();
    
    const userXpLevel = userData?.xp || 0;
    const userStandard = userData?.standard || 'freshman';
    const difficulty = userXpLevel > 500 ? 'Advanced' : userXpLevel > 200 ? 'Intermediate' : 'Beginner';
    const numQuestions = 5;

    const prompt = `Generate an eco-quiz with exactly ${numQuestions} multiple-choice questions. The questions should be for a ${userStandard} level student and have a difficulty level of ${difficulty}. Each question must have exactly one correct answer and three incorrect options. Focus on current environmental topics like climate change, renewable energy, conservation, and sustainability.

    For a difficulty level of ${difficulty}:
    ${difficulty === 'Beginner' ? '- Focus on foundational concepts and general knowledge about basic environmental issues.' :
      difficulty === 'Intermediate' ? '- Cover intermediate concepts with practical applications and moderate technical detail.' :
      '- Include advanced topics, current research, and complex real-world scenarios.'}
    
    Return the questions as a single JSON array with this exact structure:
    [
      {
        "q": "Clear and concise question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct answer text that matches exactly one of the options"
      }
    ]`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "q": { "type": "STRING" },
              "options": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              },
              "answer": { "type": "STRING" }
            },
            "propertyOrdering": ["q", "options", "answer"]
          }
        }
      }
    };

    const maxRetries = 2;
    let lastError = null;

    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
      try {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.status === 429) {
          const retryAfterHeader = response.headers.get('Retry-After');
          const delay = retryAfterHeader ? parseInt(retryAfterHeader) * 1000 : Math.pow(2, retryCount) * 2000;
          
          setRateLimitHit(true);
          setRetryAfter(Math.ceil(delay / 1000));
          setError(`Rate limit exceeded. Please wait ${Math.ceil(delay / 1000)} seconds before trying again.`);
          
          break;
        }

        if (!response.ok) {
          throw new Error(`API response was not ok: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonText) {
          throw new Error('API response did not contain valid JSON content.');
        }

        const questionsData = JSON.parse(jsonText);
        
        if (!Array.isArray(questionsData) || questionsData.length !== numQuestions) {
          throw new Error('Invalid questions format received from API.');
        }

        for (const q of questionsData) {
          if (!q.q || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer) {
            throw new Error('Invalid question structure received from API.');
          }
          if (!q.options.includes(q.answer)) {
            throw new Error('Question answer does not match any option.');
          }
        }
        
        setQuestions(questionsData);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizFinished(false);
        setGeneratingQuestions(false);
        return;
      } catch (e) {
        console.error(`Attempt ${retryCount + 1} failed:`, e);
        lastError = e;
        
        if (retryCount < maxRetries - 1) {
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
        }
      }
    }
    
    setError(`Failed to generate quiz questions: ${lastError?.message || 'Unknown error'}. Please try again in a moment.`);
    setGeneratingQuestions(false);
  }, [user, checkRateLimit, rateLimitHit, retryAfter, updateRateLimit]);
  
  const handleCorrectAnswer = useCallback(async (questionText, answerText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data for update.');
      }
      const latestUser = await response.json();
      
      const newXp = latestUser.xp + 10;
      const newQuestionsSolved = latestUser.questionsSolved + 1;
      
      const putResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          xp: newXp,
          questionsSolved: newQuestionsSolved,
          questions: [{
            questionDescription: questionText,
            questionType: "objective",
            correctAnswer: answerText,
            userAnswer: answerText,
            isCorrect: true,
          }]
        })
      });
      
      if (!putResponse.ok) {
        throw new Error('Failed to update user profile on server.');
      }
      
      const updatedUser = await putResponse.json();
      setUser(updatedUser.user);
      console.log('XP and questions solved updated successfully:', updatedUser.user);
    } catch (e) {
      console.error("Error updating user data:", e);
    }
  }, [token]);

  // Handle answer selection - refactored for instant verdict
  const handleAnswer = useCallback((selectedOption) => {
    if (selectedOption) {
      const isUserCorrect = selectedOption === questions[currentQuestionIndex].answer;
      setSelectedOption(selectedOption);
      setIsCorrect(isUserCorrect);
      setShowNextButton(true);

      if (isUserCorrect) {
        setScore(prev => prev + 1);
        handleCorrectAnswer(questions[currentQuestionIndex].q, questions[currentQuestionIndex].answer);
      }
    }
  }, [questions, currentQuestionIndex, handleCorrectAnswer]);

  // Handle moving to the next question
  const handleNextQuestion = useCallback(() => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowNextButton(false);
    } else {
      setQuizFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);


  // Restart quiz
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setError(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowNextButton(false);
    generateQuestions();
  }, [generateQuestions]);

  // Effect to countdown retry timer
  useEffect(() => {
    if (rateLimitHit && retryAfter > 0) {
      const interval = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
            setRateLimitHit(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [rateLimitHit, retryAfter]);

  // Initial user fetch
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
            <p className="text-xl font-medium">Loading your profile...</p>
            <p className="text-sm text-gray-500">Preparing personalized quiz</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !generatingQuestions) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900 p-4">
        <div className="bg-white rounded-xl p-8 border border-red-500/50 shadow-xl text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          {rateLimitHit && (
            <p className="mb-4 text-sky-500 font-medium">
              Please wait {retryAfter} seconds before trying again
            </p>
          )}
          <button 
            onClick={() => {
              setError(null);
              if (!rateLimitHit) {
                if (questions.length === 0) {
                  generateQuestions();
                }
              }
            }}
            disabled={rateLimitHit}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              rateLimitHit 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
            }`}
          >
            {rateLimitHit ? `Wait ${retryAfter}s` : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Quiz finished state
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const performanceMessage = 
      percentage >= 80 ? "Outstanding performance! 🏆" :
      percentage >= 60 ? "Good job! 👍" :
      percentage >= 40 ? "Not bad, keep improving! 🌱" :
      "Keep practicing! 💪";

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900 p-4">
 
        <div className="bg-white rounded-xl p-8 border border-green-600/50 shadow-xl text-center max-w-md">
          <Trophy className="w-20 h-20 text-sky-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-green-600">
            Quiz Complete!
          </h2>
          <div className="space-y-3 mb-6">
            <p className="text-2xl font-bold text-gray-800">{score} out of {questions.length}</p>
            <p className="text-xl text-green-600">{percentage}% Correct</p>
            <p className="text-gray-600">{performanceMessage}</p>
            <p className="text-sm text-sky-500">+{score * 10} XP earned!</p>
          </div>
          <button 
            onClick={restartQuiz} 
            disabled={rateLimitHit}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
              rateLimitHit
                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
            }`}
          >
            {rateLimitHit ? `Wait ${retryAfter}s` : 'Take Another Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Quiz generation state
  if (generatingQuestions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-16 h-16 text-sky-500 animate-spin" />
            <p className="text-xl font-medium">Generating personalized quiz...</p>
            <p className="text-sm text-gray-500">
              Creating questions based on your level: {user?.standard || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 relative">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-600">
            Eco Knowledge Challenge
          </h1>
          <p className="text-gray-600">Test your environmental knowledge and earn XP!</p>
        </div>

        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-sky-500" />
                <span className="font-medium">Question {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-medium">Score: {score}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div>XP: {user?.xp || 0}</div>
              <div>Level: {user?.standard || 'N/A'}</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 leading-relaxed text-gray-800">
              {currentQuestion.q}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrectOption = option === currentQuestion.answer;
                const isSelected = option === selectedOption;

                let buttonClasses = "bg-white border border-gray-200 text-gray-900 hover:border-sky-500";

                if (selectedOption) {
                  if (isCorrectOption) {
                    buttonClasses = "bg-green-100 border-2 border-green-600 text-green-600";
                  } else if (isSelected) {
                    buttonClasses = "bg-red-100 border-2 border-red-600 text-red-600";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => !selectedOption && handleAnswer(option)}
                    disabled={!!selectedOption}
                    className={`group rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${buttonClasses}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCorrectOption && selectedOption ? 'bg-green-600 text-white' : 
                        !isCorrectOption && isSelected ? 'bg-red-600 text-white' : 
                        'bg-gray-200 text-gray-600 group-hover:bg-sky-500 group-hover:text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-lg">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showNextButton && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-4 rounded-lg font-medium text-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors transform hover:scale-105"
                >
                  {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>

          {rateLimitHit && (
            <div className="mt-6 p-4 bg-sky-100 border border-sky-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-500" />
                <p className="text-sky-900">
                  Rate limit reached. New quiz generation available in {retryAfter} seconds.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContestPage;