"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, BookOpen, Clock, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

const ContestPage = () => {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  
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
    
    // Reset counter if window has passed
    if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
      setRequestCount(0);
      setRateLimitHit(false);
    }
    
    // Check if too many requests
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      setRateLimitHit(true);
      const timeToWait = RATE_LIMIT_WINDOW - (now - lastRequestTime);
      setRetryAfter(Math.ceil(timeToWait / 1000));
      return false;
    }
    
    // Check minimum interval
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return false;
    }
    
    return true;
  }, [requestCount, lastRequestTime]);

  // Update rate limit counters
  const updateRateLimit = useCallback(() => {
    const now = Date.now();
    setRequestCount(prev => prev + 1);
    setLastRequestTime(now);
  }, []);

  // Fetch user data with retry logic
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data.');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      // Auto-generate questions if user is loaded and no questions exist
      if (questions.length === 0) {
        setTimeout(() => generateQuestions(userData), 500); // Small delay to avoid rapid requests
      }
      
    } catch (e) {
      console.error("Error fetching user data:", e);
      setError('Failed to load user profile. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [token, questions.length]);

  // Optimized question generation with better error handling and caching
  const generateQuestions = useCallback(async (userData = user) => {
    if (!userData) {
      setError('User data not available');
      return;
    }

    // Check rate limits
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

    const maxRetries = 2; // Reduced retries to prevent excessive requests
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
          
          // Don't retry immediately on rate limit
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
        
        // Validate questions structure
        if (!Array.isArray(questionsData) || questionsData.length !== numQuestions) {
          throw new Error('Invalid questions format received from API.');
        }

        // Validate each question
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
        return; // Success, exit the function
        
      } catch (e) {
        console.error(`Attempt ${retryCount + 1} failed:`, e);
        lastError = e;
        
        // Wait before retry (but don't wait on last attempt)
        if (retryCount < maxRetries - 1) {
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
        }
      }
    }
    
    // All retries failed
    setError(`Failed to generate quiz questions: ${lastError?.message || 'Unknown error'}. Please try again in a moment.`);
    setGeneratingQuestions(false);
  }, [user, checkRateLimit, rateLimitHit, retryAfter, updateRateLimit]);

  // Handle answer selection
  const handleAnswer = useCallback((selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizFinished(true);
      updateUserXp();
    }
  }, [questions, currentQuestionIndex]);

  // Update user XP with error handling
  const updateUserXp = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error('User data is not available.');
        return;
      }
      
      const newXp = user.xp + (score * 10);
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xp: newXp }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user XP.');
      }
      
      const updatedUser = await response.json();
      setUser(prev => ({ ...prev, xp: newXp }));
      console.log('XP updated successfully:', updatedUser);
    } catch (e) {
      console.error("Error updating user XP:", e);
    }
  }, [user, score, token]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setError(null);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
            <p className="text-xl font-medium">Loading your profile...</p>
            <p className="text-sm text-gray-300">Preparing personalized quiz</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !generatingQuestions) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 text-white p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-red-500/50 shadow-2xl text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-red-300">Error</h2>
          <p className="mb-6 text-gray-200">{error}</p>
          {rateLimitHit && (
            <p className="mb-4 text-yellow-300 font-medium">
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
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
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
      percentage >= 80 ? "Outstanding performance!" :
      percentage >= 60 ? "Good job!" :
      percentage >= 40 ? "Not bad, keep improving!" :
      "Keep practicing!";

    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-green-500/50 shadow-2xl text-center max-w-md">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            Quiz Complete!
          </h2>
          <div className="space-y-3 mb-6">
            <p className="text-2xl font-bold">{score} out of {questions.length}</p>
            <p className="text-xl text-green-300">{percentage}% Correct</p>
            <p className="text-gray-300">{performanceMessage}</p>
            <p className="text-sm text-blue-300">+{score * 10} XP earned!</p>
          </div>
          <button 
            onClick={restartQuiz} 
            disabled={rateLimitHit}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
              rateLimitHit
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 transform hover:scale-105'
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-16 h-16 text-purple-400 animate-spin" />
            <p className="text-xl font-medium">Generating personalized quiz...</p>
            <p className="text-sm text-gray-300">
              Creating questions based on your level: {user?.standard || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Eco Knowledge Challenge
          </h1>
          <p className="text-gray-300">Test your environmental knowledge and earn XP!</p>
        </div>

        {/* Progress and Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Question {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Score: {score}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div>XP: {user?.xp || 0}</div>
              <div>Level: {user?.standard || 'N/A'}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 leading-relaxed">
              {currentQuestion.q}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="group bg-white/5 hover:bg-white/20 border border-white/20 hover:border-blue-400/50 rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 group-hover:bg-blue-400/20 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rate limit warning */}
          {rateLimitHit && (
            <div className="mt-6 p-4 bg-yellow-800/20 border border-yellow-600/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-200">
                  Rate limit reached. New quiz generation available in {retryAfter} seconds.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestPage;