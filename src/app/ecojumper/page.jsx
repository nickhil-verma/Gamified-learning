"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, RotateCcw, Play, Pause } from 'lucide-react';

const CarbonFootprintRunner = () => {
  // Game state
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(100); // Starting XP
  const [playerY, setPlayerY] = useState(300);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [collisionEffect, setCollisionEffect] = useState(null);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const GROUND_Y = 300;
  const PLAYER_SIZE = 40;
  const JUMP_HEIGHT = 120;
  const GRAVITY = 8;
  const PLAYER_X = 100;

  // Refs for game loop and timers
  const gameLoopRef = useRef();
  const obstacleSpawnRef = useRef();
  const collectibleSpawnRef = useRef();
  const playerYRef = useRef(playerY);

  // Eco items data
  const POLLUTING_ITEMS = [
    { emoji: '🚗', name: 'Car', width: 50 },
    { emoji: '☁️', name: 'Smoke', width: 40 },
    { emoji: '🏭', name: 'Factory', width: 60 },
    { emoji: '🛢️', name: 'Oil', width: 35 },
  ];

  const ECO_ITEMS = [
    { emoji: '🌳', name: 'Tree', width: 45 },
    { emoji: '🔋', name: 'Solar Panel', width: 40 },
    { emoji: '🚲', name: 'Bicycle', width: 50 },
    { emoji: '♻️', name: 'Recycle', width: 35 },
    { emoji: '🌿', name: 'Leaf', width: 30 },
  ];

  const ECO_FACTS = [
    "Did you know? A single tree can absorb 48 pounds of CO2 per year!",
    "Cycling just 10 miles a week can save 500 pounds of CO2 annually!",
    "Solar panels can reduce your carbon footprint by 3-4 tons per year!",
    "Recycling one aluminum can saves enough energy to power a TV for 3 hours!",
    "Walking or biking instead of driving can cut your carbon footprint by up to 2.6 tons per year!",
    "Switching to LED bulbs can reduce lighting energy use by 75%!",
  ];

  // Update playerY ref on state change
  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  // Jump mechanics
  const jump = useCallback(() => {
    if (!isJumping && gameState === 'playing') {
      setIsJumping(true);
      setPlayerY(GROUND_Y - JUMP_HEIGHT);
      setTimeout(() => {
        setPlayerY(GROUND_Y);
        setTimeout(() => setIsJumping(false), 100);
      }, 400);
    }
  }, [isJumping, gameState]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'playing') {
          jump();
        }
      }
      if (e.code === 'KeyP') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameState]);

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    if (gameState !== 'playing') return;
    const obstacle = POLLUTING_ITEMS[Math.floor(Math.random() * POLLUTING_ITEMS.length)];
    const newObstacle = {
      id: Date.now() + Math.random(),
      x: GAME_WIDTH,
      y: GROUND_Y,
      ...obstacle,
      type: 'obstacle'
    };
    setObstacles(prev => [...prev, newObstacle]);
  }, [gameState]);

  // Spawn collectibles
  const spawnCollectible = useCallback(() => {
    if (gameState !== 'playing') return;
    const collectible = ECO_ITEMS[Math.floor(Math.random() * ECO_ITEMS.length)];
    const isAirborne = Math.random() > 0.6;
    const newCollectible = {
      id: Date.now() + Math.random(),
      x: GAME_WIDTH,
      y: isAirborne ? GROUND_Y - 80 : GROUND_Y,
      ...collectible,
      type: 'collectible'
    };
    setCollectibles(prev => [...prev, newCollectible]);
  }, [gameState]);

  // Check collisions
  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: PLAYER_X - PLAYER_SIZE / 2,
      y: playerYRef.current - PLAYER_SIZE,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    };

    setObstacles(prev => {
      const remainingObstacles = [];
      prev.forEach(obstacle => {
        const obstacleRect = {
          x: obstacle.x - obstacle.width / 2,
          y: obstacle.y - obstacle.width,
          width: obstacle.width,
          height: obstacle.width
        };
        if (
          playerRect.x < obstacleRect.x + obstacleRect.width &&
          playerRect.x + playerRect.width > obstacleRect.x &&
          playerRect.y < obstacleRect.y + obstacleRect.height &&
          playerRect.y + playerRect.height > obstacleRect.y
        ) {
          setXp(currentXp => Math.max(0, currentXp - 5));
          setCollisionEffect({ type: 'damage', x: obstacle.x, y: obstacle.y });
          setTimeout(() => setCollisionEffect(null), 500);
        } else {
          remainingObstacles.push(obstacle);
        }
      });
      return remainingObstacles;
    });

    setCollectibles(prev => {
      const remainingCollectibles = [];
      prev.forEach(collectible => {
        const collectibleRect = {
          x: collectible.x - collectible.width / 2,
          y: collectible.y - collectible.width,
          width: collectible.width,
          height: collectible.width
        };
        if (
          playerRect.x < collectibleRect.x + collectibleRect.width &&
          playerRect.x + playerRect.width > collectibleRect.x &&
          playerRect.y < collectibleRect.y + collectibleRect.height &&
          playerRect.y + playerRect.height > collectibleRect.y
        ) {
          setXp(currentXp => currentXp + 10);
          setScore(currentScore => currentScore + 100);
          setCollisionEffect({ type: 'heal', x: collectible.x, y: collectible.y });
          setTimeout(() => setCollisionEffect(null), 500);
        } else {
          remainingCollectibles.push(collectible);
        }
      });
      return remainingCollectibles;
    });

    if (xp <= 5) {
      setGameState('gameOver');
    }
  }, [xp]);

  // Main game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(gameLoopRef.current);
      clearInterval(obstacleSpawnRef.current);
      clearInterval(collectibleSpawnRef.current);
      return;
    }

    const gameLoop = () => {
      // Update item positions
      setObstacles(prev =>
        prev.map(obstacle => ({ ...obstacle, x: obstacle.x - gameSpeed }))
            .filter(obstacle => obstacle.x > -obstacle.width)
      );
      setCollectibles(prev =>
        prev.map(collectible => ({ ...collectible, x: collectible.x - gameSpeed }))
            .filter(collectible => collectible.x > -collectible.width)
      );

      // Check collisions and update score
      checkCollisions();
      setScore(prev => prev + 1);
      setGameSpeed(prev => Math.min(5, prev + 0.001));

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Spawning timers (separate from game loop for better control)
    obstacleSpawnRef.current = setInterval(spawnObstacle, 2000);
    collectibleSpawnRef.current = setInterval(spawnCollectible, 3000);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      clearInterval(obstacleSpawnRef.current);
      clearInterval(collectibleSpawnRef.current);
    };
  }, [gameState, gameSpeed, checkCollisions, spawnObstacle, spawnCollectible]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setXp(100);
    setPlayerY(GROUND_Y);
    setObstacles([]);
    setCollectibles([]);
    setGameSpeed(2);
    setCollisionEffect(null);
  };

  // Restart game
  const restartGame = () => {
    startGame();
  };

  // Toggle pause
  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const randomEcoFact = ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-inter">
      <style>{`
        .ground-anim {
          background-image: linear-gradient(90deg, #bbf7d0 50%, #86efac 50%);
          background-size: 100px 100%;
          animation: ground-move 1s linear infinite;
        }
        @keyframes ground-move {
          from { background-position: 0 0; }
          to { background-position: -100px 0; }
        }
        .cloud-anim {
          background-image: radial-gradient(circle at 50% 10%, rgba(255,255,255,0.8) 20%, transparent 60%);
          animation: cloud-move 30s linear infinite;
        }
        @keyframes cloud-move {
          from { background-position: 0 0; }
          to { background-position: -800px 0; }
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-green-600 to-sky-500 text-white p-4">
          <h1 className="text-2xl font-bold text-center mb-2">Carbon Footprint Runner</h1>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>XP: {xp}</span>
              </div>
            </div>
            {gameState === 'playing' && (
              <button
                onClick={togglePause}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Game Canvas */}
        <div 
          className="relative bg-gradient-to-b from-sky-200 to-green-200"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 cloud-anim"></div>
          <div className="absolute bottom-0 w-full h-20 ground-anim"></div>
          
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-8 text-center shadow-xl"
              >
                <h2 className="text-3xl font-bold mb-4 text-green-600">Welcome Runner!</h2>
                <p className="text-gray-600 mb-6">
                  Collect eco-friendly items 🌳 and avoid polluting objects 🚗
                </p>
                <div className="text-sm text-gray-500 mb-6">
                  <p>• Jump with SPACEBAR or ↑ arrow</p>
                  <p>• Eco items: +10 XP, +100 points</p>
                  <p>• Polluting items: -5 XP</p>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Running</span>
                </button>
              </motion.div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl p-6 text-center shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-4 text-sky-500">Game Paused</h3>
                <button
                  onClick={togglePause}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
                >
                  Resume
                </button>
              </motion.div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-8 text-center shadow-xl max-w-md"
              >
                <h3 className="text-3xl font-bold mb-4 text-red-600">Game Over!</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-xl">Final Score: <span className="font-bold text-green-600">{score}</span></p>
                  <p className="text-lg">XP Earned: <span className="font-bold text-sky-500">{Math.max(0, xp - 100)}</span></p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium mb-2">🌱 Eco Fact</p>
                  <p className="text-sm text-green-700">{randomEcoFact}</p>
                </div>
                <button
                  onClick={restartGame}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              </motion.div>
            </div>
          )}

          {/* Player */}
          {(gameState === 'playing' || gameState === 'paused') && (
            <motion.div
              className="absolute text-4xl"
              style={{ 
                left: PLAYER_X - PLAYER_SIZE / 2, 
                top: playerY - PLAYER_SIZE,
                fontSize: `${PLAYER_SIZE}px`,
                lineHeight: `${PLAYER_SIZE}px`
              }}
              animate={{ 
                y: isJumping ? -10 : 0,
                rotate: isJumping ? -10 : 0
              }}
              transition={{ duration: 0.1 }}
            >
              🏃‍♂️
            </motion.div>
          )}

          {/* Obstacles */}
          <AnimatePresence>
            {obstacles.map(obstacle => (
              <motion.div
                key={obstacle.id}
                className="absolute"
                style={{
                  left: obstacle.x - obstacle.width / 2,
                  top: obstacle.y - obstacle.width,
                  fontSize: `${obstacle.width}px`,
                  lineHeight: `${obstacle.width}px`
                }}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {obstacle.emoji}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Collectibles */}
          <AnimatePresence>
            {collectibles.map(collectible => (
              <motion.div
                key={collectible.id}
                className="absolute"
                style={{
                  left: collectible.x - collectible.width / 2,
                  top: collectible.y - collectible.width,
                  fontSize: `${collectible.width}px`,
                  lineHeight: `${collectible.width}px`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -5, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity }
                }}
              >
                {collectible.emoji}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Collision Effects */}
          <AnimatePresence>
            {collisionEffect && (
              <motion.div
                className={`absolute text-2xl font-bold ${
                  collisionEffect.type === 'damage' ? 'text-red-600' : 'text-green-600'
                }`}
                style={{
                  left: collisionEffect.x,
                  top: collisionEffect.y - 50
                }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ opacity: 1, y: -30, scale: 1 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.5 }}
              >
                {collisionEffect.type === 'damage' ? '-5 XP' : '+10 XP'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Controls */}
          <div className="md:hidden absolute bottom-4 right-4">
            <button
              onClick={jump}
              disabled={isJumping}
              className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl border-2 border-gray-300 active:scale-95 transition-transform"
            >
              ⬆️
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
          <p className="mb-1">Desktop: SPACEBAR or ↑ to jump | P to pause</p>
          <p>Mobile: Tap the jump button</p>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintRunner;
