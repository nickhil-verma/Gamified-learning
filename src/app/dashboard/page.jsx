"use client";

import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setUser(data); // ✅ directly assign user object
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

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user)
    return (
      <div className="p-6 text-red-500">
        Failed to load user. Please login again.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username} 🎉</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Standard:</strong> {user.standard}</p>
        <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
        <p><strong>Subjects:</strong> {user.subjects?.length ? user.subjects.join(", ") : "None"}</p>
        <p><strong>XP:</strong> {user.xp}</p>
        <p><strong>Game Points:</strong> {user.gamePoints}</p>
        <p><strong>Games Won:</strong> {user.gamesWon}</p>
        <p><strong>Questions Solved:</strong> {user.questionsSolved}</p>
        <p><strong>Badges:</strong> {user.badges?.length ? user.badges.join(", ") : "None"}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
      </div>

      {/* Debug section: show embeddings count */}
      {user.embeddings && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Embeddings</h2>
          <p>Total Embeddings: {user.embeddings.length}</p>
          <p>Source: {user.embeddings[0]?.source}</p>
          <p>Created At: {new Date(user.embeddings[0]?.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
