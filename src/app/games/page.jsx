"use client";

import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Play, RotateCcw } from "lucide-react";

const initialGames = [
  {
    id: 1,
    name: "Eco Quest",
    desc: "Complete missions to save the planet.",
    thumbnail: "https://via.placeholder.com/400x220.png?text=Eco+Quest",
    likes: 12,
    inProgress: false,
  },
  {
    id: 2,
    name: "Recycle Rush",
    desc: "Sort waste and earn eco points.",
    thumbnail: "https://via.placeholder.com/400x220.png?text=Recycle+Rush",
    likes: 34,
    inProgress: true,
  },
  {
    id: 3,
    name: "Carbon Zero",
    desc: "Build a zero-emission city.",
    thumbnail: "https://via.placeholder.com/400x220.png?text=Carbon+Zero",
    likes: 20,
    inProgress: false,
  },
  {
    id: 4,
    name: "Green Tycoon",
    desc: "Manage resources sustainably.",
    thumbnail: "https://via.placeholder.com/400x220.png?text=Green+Tycoon",
    likes: 8,
    inProgress: true,
  },
];

const GamesPage = () => {
  const [games, setGames] = useState(initialGames);

  const toggleLike = (id) => {
    setGames((prev) =>
      prev.map((game) =>
        game.id === id
          ? { ...game, likes: game.likes + 1 }
          : game
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-green-600 mb-12 text-center tracking-tight">
          🎮 Gamified Sustainability Hub
        </h1>

        {/* Grid of Game Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className="group shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white rounded-2xl overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                />
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-sky-500 text-xl font-semibold tracking-wide">
                  {game.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {game.desc}
                </p>

                {/* Likes + Play/Continue */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(game.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="text-sm font-medium">{game.likes}</span>
                  </button>

                  {game.inProgress ? (
                    <Button className="bg-sky-500 text-white hover:bg-sky-600 rounded-xl flex items-center space-x-1 px-4 py-2 transition-all duration-200">
                      <RotateCcw className="h-4 w-4" />
                      <span>Continue</span>
                    </Button>
                  ) : (
                    <Button className="bg-green-600 text-white hover:bg-green-700 rounded-xl flex items-center space-x-1 px-4 py-2 transition-all duration-200">
                      <Play className="h-4 w-4" />
                      <span>Play</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GamesPage;
