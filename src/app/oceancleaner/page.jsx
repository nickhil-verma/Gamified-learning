"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAME_AREA_HEIGHT = 600;
const GAME_AREA_WIDTH = 800;
const BOAT_WIDTH = 80;
const TRASH_SIZE = 40;
const TRASH_SPEED = 2;
const SPAWN_RATE = 0.02;
const MAX_MISSED_TRASH = 15;

const TRASH_TYPES = [
  { emoji: '🍶', type: 'bottle', color: 'text-blue-400' },
  { emoji: '🥤', type: 'can', color: 'text-red-400' },
  { emoji: '🛍️', type: 'bag', color: 'text-gray-400' },
  { emoji: '🧴', type: 'container', color: 'text-green-400' },
];

const ECO_FACTS = [
  "Every minute, a garbage truck's worth of plastic enters our oceans.",
  "Over 8 million tons of plastic waste enters the ocean each year.",
  "Marine animals mistake plastic debris for food, which can be fatal.",
  "A plastic bottle takes 450 years to decompose in the ocean.",
  "There are 5 massive garbage patches in our oceans, the largest being twice the size of Texas.",
  "By 2050, there could be more plastic than fish in the ocean by weight.",
];

const OceanCleaner = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [boatPosition, setBoatPosition] = useState(GAME_AREA_WIDTH / 2 - BOAT_WIDTH / 2);
  const [trash, setTrash] = useState([]);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [missedTrash, setMissedTrash] = useState(0);
  const [gameLoop, setGameLoop] = useState(null);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setXp(0);
    setMissedTrash(0);
    setTrash([]);
    setBoatPosition(GAME_AREA_WIDTH / 2 - BOAT_WIDTH / 2);
  };

  const endGame = () => {
    setGameState('gameOver');
    if (gameLoop) {
      clearInterval(gameLoop);
      setGameLoop(null);
    }
  };

  const moveBoat = useCallback((direction) => {
    setBoatPosition(prev => {
      const newPos = direction === 'left' ? prev - 30 : prev + 30;
      return Math.max(0, Math.min(GAME_AREA_WIDTH - BOAT_WIDTH, newPos));
    });
  }, []);

  const spawnTrash = useCallback(() => {
    if (Math.random() < SPAWN_RATE) {
      const newTrash = {
        id: Date.now() + Math.random(),
        x: Math.random() * (GAME_AREA_WIDTH - TRASH_SIZE),
        y: 0,
        type: TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)],
      };
      setTrash(prev => [...prev, newTrash]);
    }
  }, []);

  const updateGame = useCallback(() => {
    setTrash(prev => {
      const updated = prev.map(item => ({ ...item, y: item.y + TRASH_SPEED }));
      
      // Check for collisions with boat
      const collected = [];
      const remaining = updated.filter(item => {
        const isCollected = item.y + TRASH_SIZE >= GAME_AREA_HEIGHT - 80 &&
                           item.y <= GAME_AREA_HEIGHT - 40 &&
                           item.x + TRASH_SIZE > boatPosition &&
                           item.x < boatPosition + BOAT_WIDTH;
        
        if (isCollected) {
          collected.push(item);
          return false;
        }
        return item.y < GAME_AREA_HEIGHT + TRASH_SIZE;
      });

      // Update score and XP for collected trash
      if (collected.length > 0) {
        setScore(s => s + collected.length);
        setXp(x => x + collected.length * 10);
      }

      // Count missed trash (trash that went off screen)
      const missedCount = updated.length - remaining.length - collected.length;
      if (missedCount > 0) {
        setMissedTrash(m => {
          const newMissed = m + missedCount;
          if (newMissed >= MAX_MISSED_TRASH) {
            setTimeout(endGame, 100);
          }
          return newMissed;
        });
      }

      return remaining;
    });

    spawnTrash();
  }, [boatPosition, spawnTrash]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      const loop = setInterval(updateGame, 50);
      setGameLoop(loop);
      return () => clearInterval(loop);
    }
  }, [gameState, updateGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'playing') {
        if (e.key === 'ArrowLeft') {
          moveBoat('left');
        } else if (e.key === 'ArrowRight') {
          moveBoat('right');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, moveBoat]);

  const pollutionLevel = Math.min((missedTrash / MAX_MISSED_TRASH) * 100, 100);
  const randomEcoFact = ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 text-center">
          <h1 className="text-4xl font-bold mb-2">🌊 Ocean Cleaner 🚤</h1>
          <p className="text-blue-100">Save our oceans, one piece of trash at a time!</p>
        </div>

        {/* Game Area */}
        <div className="relative bg-gradient-to-b from-sky-300 via-blue-400 to-blue-600 flex justify-center">
          <div 
            className="relative overflow-hidden"
            style={{ width: GAME_AREA_WIDTH, height: GAME_AREA_HEIGHT }}
          >
            
            {/* Menu Screen */}
            <AnimatePresence>
              {gameState === 'menu' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-400/90 to-blue-600/90 z-20"
                >
                  <div className="text-center text-white mb-8">
                    <h2 className="text-6xl mb-4">🌊</h2>
                    <h3 className="text-3xl font-bold mb-4">Ready to Clean the Ocean?</h3>
                    <p className="text-xl mb-2">Use ← → arrow keys or buttons to move your boat</p>
                    <p className="text-lg mb-4">Catch falling trash to earn XP and save marine life!</p>
                    <p className="text-yellow-200 font-semibold">Don't let too much trash pollute the ocean!</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg"
                  >
                    🚀 Start Cleaning!
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Over Screen */}
            <AnimatePresence>
              {gameState === 'gameOver' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-400/90 to-red-600/90 z-20"
                >
                  <div className="text-center text-white mb-8 px-6">
                    <h2 className="text-6xl mb-4">💔</h2>
                    <h3 className="text-3xl font-bold mb-4">Ocean Polluted!</h3>
                    <div className="bg-white/20 rounded-lg p-6 mb-6">
                      <p className="text-xl mb-4">Final Score: <span className="font-bold">{score} pieces</span></p>
                      <p className="text-lg mb-4">Total XP: <span className="font-bold">{xp}</span></p>
                      <div className="bg-blue-900/50 rounded p-4">
                        <p className="text-sm font-semibold text-yellow-200 mb-2">🐠 Ocean Fact:</p>
                        <p className="text-sm leading-relaxed">{randomEcoFact}</p>
                      </div>
                    </div>
                    <p className="text-lg">Keep cleaning to protect our marine friends!</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg"
                  >
                    🔄 Try Again
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Waves Animation */}
            <div className="absolute bottom-0 w-full">
              <motion.div
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="opacity-30"
              >
                <div className="h-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full transform -translate-y-8"></div>
              </motion.div>
            </div>

            {/* Floating Trash */}
            <AnimatePresence>
              {trash.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className={`absolute text-4xl ${item.type.color} drop-shadow-lg`}
                  style={{
                    left: item.x,
                    top: item.y,
                    width: TRASH_SIZE,
                    height: TRASH_SIZE,
                  }}
                >
                  {item.type.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Boat */}
            {gameState === 'playing' && (
              <motion.div
                animate={{ x: boatPosition }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-4 text-6xl drop-shadow-lg"
                style={{ width: BOAT_WIDTH }}
              >
                🚤
              </motion.div>
            )}

            {/* Pollution Overlay */}
            {gameState === 'playing' && pollutionLevel > 0 && (
              <div 
                className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-800/20 to-transparent pointer-events-none"
                style={{ opacity: pollutionLevel / 100 }}
              />
            )}
          </div>
        </div>

        {/* Game Stats */}
        {gameState === 'playing' && (
          <div className="bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                  <p className="text-sm text-gray-600">Trash Collected</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{xp}</p>
                  <p className="text-sm text-gray-600">XP Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{missedTrash}/{MAX_MISSED_TRASH}</p>
                  <p className="text-sm text-gray-600">Missed Trash</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Ocean Health</p>
                <div className="w-32 h-4 bg-gray-300 rounded-full">
                  <div 
                    className="h-4 bg-gradient-to-r from-green-500 to-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${pollutionLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => moveBoat('left')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                ← Move Left
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => moveBoat('right')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                Move Right →
              </motion.button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-600 text-sm">
            🌍 Every piece of trash you collect helps save our oceans and marine life! 🐠
          </p>
        </div>
      </div>
    </div>
  );
};

export default OceanCleaner;