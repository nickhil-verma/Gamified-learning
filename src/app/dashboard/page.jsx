"use client";

import AnimatedProgressBar from "@/components/smoothui/ui/AnimatedProgressBar";
import BasicToast from "@/components/smoothui/ui/BasicToast";
import UserAccountAvatar from "@/components/smoothui/ui/UserAccountAvatar";
import Navbar from "@/components/ui/Navbar";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Function to calculate XP level and progress
  const getXpProgress = (xp) => {
    // Define simple leveling system (can be customized)
    const levels = [
      { level: 1, xpNeeded: 100 },
      { level: 2, xpNeeded: 250 },
      { level: 3, xpNeeded: 500 },
      { level: 4, xpNeeded: 1000 },
      { level: 5, xpNeeded: 2000 },
    ];

    let currentLevel = 0;
    let xpForLevel = 0;
    let nextLevelXp = 0;

    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].xpNeeded) {
        currentLevel = levels[i].level;
        xpForLevel = levels[i].xpNeeded;
        nextLevelXp = levels[i + 1] ? levels[i + 1].xpNeeded : xp;
      } else {
        currentLevel = levels[i].level;
        xpForLevel = i > 0 ? levels[i - 1].xpNeeded : 0;
        nextLevelXp = levels[i].xpNeeded;
        break;
      }
    }
    
    const progress = Math.min(100, Math.round(((xp - xpForLevel) / (nextLevelXp - xpForLevel)) * 100));

    return {
      currentLevel,
      progress,
      xpTillNextLevel: nextLevelXp - xp,
    };
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          // Show the toast message upon successful data load
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-6 text-center text-lg font-medium">Loading...</div>;

  if (!user)
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Failed to load user. Please login again.
      </div>
    );
    
  const xpData = getXpProgress(user.xp);
  
  // Mock data for the leaderboard and badges
  const leaderboardData = [
    { username: 'AlphaGamer', xp: 2500, avatar: 'A' },
    { username: 'BetaMaster', xp: 1800, avatar: 'B' },
    { username: 'ChallengerX', xp: 1550, avatar: 'C' },
    { username: 'DeltaKnight', xp: 1200, avatar: 'D' },
  ];

  const badgeIcons = {
    'First Game': '🚀',
    'Quiz Master': '🧠',
    'Socializer': '🤝',
    'First Win': '🏆',
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 transition-all duration-300">
      <style jsx global>{`
        /* Custom scrollbar for chat window */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
          border: 2px solid #f1f5f9;
        }

        /* Keyframes for the toast animation */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>

      <Navbar />

      <div className="container mx-auto px-6 py-10">
        
        {/* Dynamic Toast Message */}
        {showToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
            <BasicToast message={`Welcome back, ${user.username}!`} type="success" />
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-3xl">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
            <UserAccountAvatar username={user.username} />
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Welcome, {user.firstName}! 🎉
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Your personalized dashboard awaits.
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-gray-500 text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Progress & Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* XP Progress Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4 transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
            <p className="text-gray-600">
              Level: <span className="font-semibold text-sky-500 text-2xl">{xpData.currentLevel}</span>
            </p>
            <div className="flex flex-col space-y-2">
              <AnimatedProgressBar xp={xpData.progress} />
              <p className="text-sm text-gray-500 text-center">
                <span className="font-bold text-gray-700">{user.xp} XP</span> earned ({xpData.xpTillNextLevel} to next level)
              </p>
            </div>
          </div>

          {/* About Me Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About You</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age || "N/A"}</p>
              <p><strong>Standard:</strong> {user.standard || "N/A"}</p>
              <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
              <p><strong>Subjects:</strong> {user.subjects?.length ? user.subjects.join(", ") : "None"}</p>
            </div>
          </div>

          {/* Gaming Stats Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gaming Stats</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Game Points:</strong> <span className="font-semibold text-green-500">{user.gamePoints}</span></p>
              <p><strong>Games Won:</strong> <span className="font-semibold text-purple-500">{user.gamesWon}</span></p>
              <p><strong>Questions Solved:</strong> <span className="font-semibold text-blue-500">{user.questionsSolved}</span></p>
            </div>
          </div>
        </div>
        
        {/* Badges and Leaderboard Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Badges Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Badges</h2>
            <div className="flex flex-wrap gap-4">
              {user.badges?.length > 0 ? (
                user.badges.map((badge, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-100 rounded-xl">
                    <span className="text-4xl">{badgeIcons[badge] || '🏅'}</span>
                    <span className="text-sm font-medium text-gray-600 mt-2">{badge}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You haven't earned any badges yet.</p>
              )}
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Players</h2>
            <div className="space-y-4">
              {leaderboardData.map((player, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-xl font-bold w-6">{index + 1}.</span>
                  <div className="flex-shrink-0">
                    <UserAccountAvatar username={player.username} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{player.username}</p>
                    <p className="text-sm text-gray-500">{player.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Debug section: show embeddings count */}
        {user.embeddings && user.embeddings.length > 0 && (
          <div className="mt-6 bg-gray-200/50 p-6 rounded-3xl shadow-lg border border-gray-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Embeddings Data (Debug)</h2>
            <p className="text-gray-600">Total Embeddings: <span className="font-semibold">{user.embeddings.length}</span></p>
            <p className="text-gray-600">Source: <span className="font-medium">{user.embeddings[0]?.source}</span></p>
            <p className="text-gray-600">Created At: <span className="font-medium">{new Date(user.embeddings[0]?.createdAt).toLocaleString()}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
