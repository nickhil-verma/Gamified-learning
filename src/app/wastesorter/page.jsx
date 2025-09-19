"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The main App component containing the entire game
const App = () => {
  // Game state
  const [xp, setXp] = useState(0);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('Drag each item to the correct bin!');
  const [fact, setFact] = useState('');
  const [loadingFact, setLoadingFact] = useState(false);
  const [lastFactXp, setLastFactXp] = useState(0);
  const [isHoveringBin, setIsHoveringBin] = useState(null);

  // API configuration
  const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const ITEM_TYPES = [
    { type: 'plastic', emoji: '🥤', label: 'Plastic Bottle' },
    { type: 'glass', emoji: '🍾', label: 'Glass Bottle' },
    { type: 'paper', emoji: '📰', label: 'Newspaper' },
    { type: 'organic', emoji: '🍎', label: 'Apple Core' },
    { type: 'plastic', emoji: '🥛', label: 'Plastic Jug' },
    { type: 'glass', emoji: '🫙', label: 'Glass Jar' },
    { type: 'paper', emoji: '📦', label: 'Cardboard Box' },
    { type: 'organic', emoji: '🍌', label: 'Banana Peel' },
  ];

  const BINS = [
    { type: 'plastic', emoji: '♻️', label: 'Plastic', color: 'bg-green-600' },
    { type: 'glass', emoji: '🍾', label: 'Glass', color: 'bg-sky-500' },
    { type: 'paper', emoji: '📰', label: 'Paper', color: 'bg-amber-500' },
    { type: 'organic', emoji: '🍎', label: 'Organic', color: 'bg-gray-600' },
  ];

  const generateItems = useCallback(() => {
    const newItems = Array.from({ length: 8 }, (_, i) => ({
      ...ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
      id: i, // Add a unique ID for Framer Motion's key
    }));
    setItems(newItems);
  }, []);

  const handleDrop = useCallback((item, binType) => {
    if (item.type === binType) {
      setMessage('Correct! Great job helping the planet!');
      setXp(prev => prev + 10);
      setItemsSorted(prev => prev + 1);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setMessage(`Oops, that's not for the ${binType} bin. Try again!`);
      setXp(prev => Math.max(0, prev - 5));
    }
  }, []);

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

  // Initialize and check for new facts
  useEffect(() => {
    if (items.length === 0 && xp > 0) {
      generateItems();
      setMessage('Round complete! New items are ready.');
    } else if (items.length === 0) {
      generateItems();
    }
  }, [items, generateItems, xp]);

  useEffect(() => {
    if (xp > lastFactXp + 20) {
      const topics = ["recycling paper", "plastic pollution", "composting organic waste", "glass recycling"];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      getGeminiFact(randomTopic);
      setLastFactXp(xp);
    }
  }, [xp, getGeminiFact, lastFactXp]);

  const factProgress = ((xp - lastFactXp) / 20) * 100;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter flex flex-col items-center p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto">
        {/* Game Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-2">
            Recycle Sorter 🔄
          </h1>
          <p className="text-lg text-gray-600">Sort the items to save the planet!</p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <span className="text-lg font-semibold text-green-600">XP: {xp}</span>
            <span className="text-lg font-semibold text-gray-500">Items Sorted: {itemsSorted}</span>
          </div>
        </header>

        {/* Game Area */}
        <main className="flex flex-col items-center space-y-8">
          <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-200 rounded-xl shadow-inner border-2 border-gray-300 min-h-[120px] w-full">
            <AnimatePresence>
              {items.length > 0 ? items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center text-5xl cursor-grab active:cursor-grabbing shadow-lg"
                  drag
                  dragSnapToOrigin={true}
                  onDragStart={() => setIsHoveringBin(null)}
                  onDragEnd={(e, info) => {
                    const rect = e.target.getBoundingClientRect();
                    const dropX = rect.x + rect.width / 2;
                    const dropY = rect.y + rect.height / 2;
                    const bins = document.querySelectorAll('.bin');
                    let droppedInBin = false;
                    bins.forEach(bin => {
                      const binRect = bin.getBoundingClientRect();
                      if (dropX >= binRect.left && dropX <= binRect.right && dropY >= binRect.top && dropY <= binRect.bottom) {
                        handleDrop(item, bin.dataset.type);
                        droppedInBin = true;
                      }
                    });
                    if (!droppedInBin) {
                      setMessage('Drag the item to a bin to sort it!');
                    }
                    setIsHoveringBin(null);
                  }}
                  onDrag={(e, info) => {
                    const rect = e.target.getBoundingClientRect();
                    const dropX = rect.x + rect.width / 2;
                    const dropY = rect.y + rect.height / 2;
                    const bins = document.querySelectorAll('.bin');
                    let hoveringType = null;
                    bins.forEach(bin => {
                      const binRect = bin.getBoundingClientRect();
                      if (dropX >= binRect.left && dropX <= binRect.right && dropY >= binRect.top && dropY <= binRect.bottom) {
                        hoveringType = bin.dataset.type;
                      }
                    });
                    setIsHoveringBin(hoveringType);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  {item.emoji}
                </motion.div>
              )) : <p className="text-lg text-gray-500 self-center">No items to sort. Great job!</p>}
            </AnimatePresence>
          </div>

          <div className="text-lg text-center h-8 font-medium">
            {message && <p className="text-sky-500 animate-pulse">{message}</p>}
          </div>

          <div className="flex justify-center gap-4 md:gap-8 w-full max-w-lg">
            {BINS.map(bin => (
              <motion.div
                key={bin.type}
                data-type={bin.type}
                className={`bin flex-1 p-4 rounded-xl text-center border-4 border-dashed border-gray-400 ${bin.color} text-white transition-all duration-300 transform`}
                animate={{
                  scale: isHoveringBin === bin.type ? 1.05 : 1,
                  boxShadow: isHoveringBin === bin.type ? '0 0 10px 4px rgba(255,255,255,0.7)' : 'none',
                }}
              >
                <div className="text-6xl">{bin.emoji}</div>
                <div className="mt-2 text-sm md:text-base font-bold">{bin.label}</div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={generateItems}
            className="w-full max-w-xs py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors duration-300 transform active:scale-95"
          >
            Start New Round
          </button>
        </main>

        {/* Eco Fact Section */}
        <section className="bg-gray-200 rounded-xl p-6 border border-gray-300 text-center relative mt-8">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Eco Fact
          </div>
          <p className="mt-4 text-gray-600 text-lg md:text-xl font-medium">
            {loadingFact ? 'Generating a new fact...' : fact || 'Sort items to learn a new eco-friendly fact!'}
          </p>
          <div className="w-full mt-4 h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green-500" 
              initial={{ width: '0%' }}
              animate={{ width: `${factProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            ></motion.div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {`Progress to next fact: ${Math.round(factProgress)}%`}
          </p>
        </section>
      </div>
    </div>
  );
};

export default App;
