// Leaderboard.tsx

import { safeUser } from "@/types";
import "../../globals.css";
import React, { useEffect, useState } from "react";
import { couldStartTrivia } from "typescript";
import { Enriqueta } from "next/font/google";

interface DashboardProps {
  user: safeUser;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
}

const Leaderboard: React.FC<DashboardProps> = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "",
      name: "",
      points: 0,
    },
  ]);
  const [userPoints, setUserPoints] = useState<number>(0);

  useEffect(() => {
    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/getLeaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard data");
        const data = await response.json();
        setLeaderboard(data);

        const currentUserEntry = data.find(
          (entry: LeaderboardEntry) => entry.id === user.id
        );
        if (currentUserEntry) {
          setUserPoints(currentUserEntry.points);
        } else {
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [user.id]);

  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 min-h-screen w-full">
      <div className="container max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          Leaderboard
        </h1>
        <div className="mb-4 text-lg flex justify-between items-center bg-blue-200 rounded-lg p-4 shadow">
          <span className="font-medium">Your Points:</span>
          <span className="text-blue-800">{userPoints}</span>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
          {" "}
          {/* Adjust maxHeight to fit 10 users */}
          <table className="w-full">
            <thead>
              <tr className="text-left bg-blue-100">
                <th className="py-3 px-6 font-semibold text-blue-800">User</th>
                <th className="py-3 px-6 font-semibold text-right text-blue-800">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="pt-2 pb-2 pl-4 pr-2 font-medium text-black">
                    {entry.name}
                  </td>
                  <td className="pt-2 pb-2 pl-2 pr-4 text-right text-black">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Scores are updated everytime a competition ends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
