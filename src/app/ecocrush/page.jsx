"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';

// The main App component containing the entire game
const App = () => {
  // Game state
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(0);
  const [fact, setFact] = useState('');
  const [loadingFact, setLoadingFact] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [draggedTile, setDraggedTile] = useState(null);
  const [message, setMessage] = useState('');
  const [lastFactScore, setLastFactScore] = useState(0);
  const [hint, setHint] = useState(null);
  const [loading, setLoading] = useState(false);

  // API configuration
  const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const GRID_SIZE = 8;
  const TILE_TYPES = ['💧', '🌿', '☀️', '♻️', '🌍', '🌱', '🗑️'];
  const TRASH_TILE = '🗑️';

  // Board creation and game logic
  const createBoard = useCallback(() => {
    const newBoard = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => 
        TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)]
      )
    );
    setBoard(newBoard);
  }, []);

  const checkForMatches = useCallback((currentBoard) => {
    const newMatches = new Set();
    // Check horizontal matches
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        const tile1 = currentBoard[i][j];
        if (tile1 && tile1 === currentBoard[i][j+1] && tile1 === currentBoard[i][j+2]) {
          newMatches.add(`${i},${j}`);
          newMatches.add(`${i},${j+1}`);
          newMatches.add(`${i},${j+2}`);
        }
      }
    }
    // Check vertical matches
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const tile1 = currentBoard[i][j];
        if (tile1 && tile1 === currentBoard[i+1][j] && tile1 === currentBoard[i+2][j]) {
          newMatches.add(`${i},${j}`);
          newMatches.add(`${i+1},${j}`);
          newMatches.add(`${i+2},${j}`);
        }
      }
    }
    return Array.from(newMatches);
  }, []);

  const removeMatchesAndRefill = useCallback((matches) => {
    if (matches.length === 0) return;

    const newBoard = board.map(row => [...row]);
    let trashMatchCount = 0;

    matches.forEach(match => {
      const [r, c] = match.split(',').map(Number);
      if (newBoard[r][c] === TRASH_TILE) {
        trashMatchCount++;
      }
      newBoard[r][c] = null;
    });

    const points = matches.length * 10;
    const bonusPoints = trashMatchCount * 50;
    setScore(prev => prev + points + bonusPoints);
    setHp(prev => prev + matches.length * 2 + bonusPoints / 10);
    
    setBoard(newBoard);

    // Gravity effect: fill from the top
    setTimeout(() => {
      const newBoardAfterGravity = newBoard.map(r => [...r]);
      for (let j = 0; j < GRID_SIZE; j++) {
        let emptyCells = 0;
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
          if (newBoardAfterGravity[i][j] === null) {
            emptyCells++;
          } else if (emptyCells > 0) {
            newBoardAfterGravity[i + emptyCells][j] = newBoardAfterGravity[i][j];
            newBoardAfterGravity[i][j] = null;
          }
        }
      }

      // Refill empty cells
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newBoardAfterGravity[i][j] === null) {
            newBoardAfterGravity[i][j] = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
          }
        }
      }

      setBoard(newBoardAfterGravity);
    }, 500);

  }, [board]);

  const swapTiles = useCallback((r1, c1, r2, c2) => {
    const newBoard = board.map(r => [...r]);
    const temp = newBoard[r1][c1];
    newBoard[r1][c1] = newBoard[r2][c2];
    newBoard[r2][c2] = temp;
    setBoard(newBoard);
    setSelectedTile(null);
  }, [board]);

  const handleTileClick = useCallback((row, col) => {
    if (selectedTile) {
      const [r1, c1] = selectedTile;
      if (Math.abs(r1 - row) + Math.abs(c1 - col) === 1) {
        swapTiles(r1, c1, row, col);
      } else {
        setSelectedTile([row, col]);
      }
    } else {
      setSelectedTile([row, col]);
    }
  }, [selectedTile, swapTiles]);

  const checkforPossibleMoves = useCallback(() => {
    // This is a simple check that finds the first valid move.
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Try swapping with right tile
        if (j < GRID_SIZE - 1) {
          const tempBoard = board.map(r => [...r]);
          const temp = tempBoard[i][j];
          tempBoard[i][j] = tempBoard[i][j+1];
          tempBoard[i][j+1] = temp;
          if (checkForMatches(tempBoard).length > 0) {
            setHint([[i,j], [i,j+1]]);
            return;
          }
        }
        // Try swapping with bottom tile
        if (i < GRID_SIZE - 1) {
          const tempBoard = board.map(r => [...r]);
          const temp = tempBoard[i][j];
          tempBoard[i][j] = tempBoard[i+1][j];
          tempBoard[i+1][j] = temp;
          if (checkForMatches(tempBoard).length > 0) {
            setHint([[i,j], [i+1,j]]);
            return;
          }
        }
      }
    }
    setMessage("No moves available. The board will be reset.");
    setTimeout(createBoard, 2000);
  }, [board, checkForMatches, createBoard]);

  const getGeminiFact = useCallback(async (topic) => {
    setLoadingFact(true);
    try {
      const prompt = `Generate a single, interesting, and simple eco-friendly fact about ${topic}. The fact should be no more than two sentences long. Do not include a title or introduction.`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('API request failed');
      const result = await response.json();
      const factText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate fact.";
      setFact(factText);

    } catch (e) {
      console.error("Error generating fact:", e);
      setFact("Could not load a new fact. Please try again later.");
    } finally {
      setLoadingFact(false);
    }
  }, []);

  // Main game loop effect
  useEffect(() => {
    if (board.length === 0) {
      createBoard();
      return;
    }

    const matches = checkForMatches(board);
    if (matches.length > 0) {
      removeMatchesAndRefill(matches);
      setHint(null);
      setMessage('');
    } else {
      // If no matches after a swap, swap back
      if (selectedTile && draggedTile) {
        const [r1, c1] = selectedTile;
        const [r2, c2] = draggedTile;
        swapTiles(r1, c1, r2, c2);
        setMessage('Invalid move, no match found.');
      }
    }
  }, [board, checkForMatches, removeMatchesAndRefill, createBoard]);

  // Handle score milestones for facts
  useEffect(() => {
    if (score > lastFactScore + 200) {
      const topics = ["sustainable fashion", "composting", "water conservation", "air pollution"];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      getGeminiFact(randomTopic);
      setLastFactScore(score);
    }
  }, [score, getGeminiFact, lastFactScore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mb-4"></div>
        <p className="text-xl font-medium">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter flex flex-col items-center p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto">
        {/* Game Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-2">
            Eco-Match: Planet Protector
          </h1>
          <p className="text-lg text-gray-600">Match the symbols, save the world!</p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <span className="text-lg font-semibold text-green-600">Score: {score}</span>
            <span className="text-lg font-semibold text-sky-500">HP: {hp}</span>
          </div>
        </header>

        {/* Game Board */}
        <main className="flex flex-col items-center space-y-8">
          <div className="inline-grid gap-2 p-2 bg-gray-200 rounded-xl shadow-lg border-2 border-gray-300"
               style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
            {board.flat().map((tile, index) => {
              const row = Math.floor(index / GRID_SIZE);
              const col = index % GRID_SIZE;
              const isSelected = selectedTile && selectedTile[0] === row && selectedTile[1] === col;
              const isHinted = hint && hint.some(h => h[0] === row && h[1] === col);

              return (
                <div 
                  key={index} 
                  className={`
                    w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg
                    flex items-center justify-center text-4xl cursor-pointer
                    transition-all duration-300 ease-out
                    ${isSelected ? 'scale-110 ring-4 ring-green-600' : 'hover:scale-105'}
                    ${isHinted ? 'animate-pulse ring-4 ring-sky-500' : ''}
                  `}
                  onClick={() => handleTileClick(row, col)}
                >
                  {tile}
                </div>
              );
            })}
          </div>

          {/* Game Controls & Message */}
          <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
            <div className="text-sm text-center font-medium text-gray-600">
              <span className="font-bold text-green-600">Hint:</span> Match trash tiles <span className="text-2xl align-middle">🗑️</span> to get a score bonus!
            </div>
            <div className="text-lg text-center h-8 font-medium">
              {message && <p className="text-sky-500 animate-pulse">{message}</p>}
            </div>
            
            <div className="flex space-x-4 w-full">
              <button
                onClick={checkforPossibleMoves}
                className="flex-1 py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md transition-colors duration-300 transform active:scale-95"
              >
                Show Hint
              </button>
              <button
                onClick={() => { createBoard(); setScore(0); setHp(100); setSelectedTile(null); setFact(''); setHint(null); }}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors duration-300 transform active:scale-95"
              >
                Restart Game
              </button>
            </div>
          </div>
        </main>

        {/* Eco Fact Section */}
        <section className="bg-gray-200 rounded-xl p-6 border border-gray-300 text-center relative mt-8">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Eco Fact
          </div>
          <p className="mt-4 text-gray-600 text-lg md:text-xl font-medium">
            {loadingFact ? 'Generating a new fact...' : fact || 'Match symbols to learn new eco-friendly facts!'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default App;
