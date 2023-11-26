"use client";
import React, { useEffect, useState } from "react";
import { FaHome, FaChartLine, FaTrophy, FaUserCog } from "react-icons/fa";

interface SidebarProps {
  activeContent: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeContent, setContent }) => {
  const [isActive, setActive] = useState<string>(activeContent);

  return (
    <div className="flex flex-col h-screen w-64 bg-blue-900 text-white">
      <div
        onClick={() => {
          setActive("dashboard");
          setContent("dashboard");
        }}
        className={`flex items-center p-4 rounded hover:bg-blue-700 ${
          isActive === "dashboard" && "bg-blue-700"
        }`}
      >
        <FaHome className="mr-4" size={20} />
        Dashboard
      </div>
      <div
        onClick={() => {
          setActive("mycomp");
          setContent("mycomp");
        }}
        className={`flex items-center p-4 rounded hover:bg-blue-700 ${
          isActive === "mycomp" && "bg-blue-700"
        }`}
      >
        <FaChartLine className="mr-4" size={20} />
        My Competitions
      </div>
      <div
        onClick={() => {
          setActive("leaderboard");
          setContent("leaderboard");
        }}
        className={`flex items-center p-4 rounded hover:bg-blue-700 ${
          isActive === "leaderboard" && "bg-blue-700"
        }`}
      >
        <FaTrophy className="mr-4" size={20} />
        Leaderboard
      </div>
      <div
        onClick={() => {
          setActive("settings");
          setContent("settings");
        }}
        className={`flex items-center p-4 rounded hover:bg-blue-700 ${
          isActive === "settings" && "bg-blue-700"
        }`}
      >
        <FaUserCog className="mr-4" size={20} />
        Account Settings
      </div>
    </div>
  );
};

export default Sidebar;
