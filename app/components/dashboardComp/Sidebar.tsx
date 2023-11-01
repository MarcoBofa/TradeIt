import React from "react";
import { FaHome, FaChartLine, FaTrophy, FaUserCog } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-300 w-64 bg-blue-900 text-white items-center justify-center">
      <div className="py-6 px-4 flex-1 w-full">
        <div className="mb-4">
          <div className="flex items-center p-4 rounded hover:bg-blue-700 ">
            <FaHome className="mr-4" size={20} />
            Dashboard
          </div>
          <div className="flex items-center p-4 rounded hover:bg-blue-700 ">
            <FaChartLine className="mr-4" size={20} />
            My stocks
          </div>
          <div className="flex items-center p-4 rounded hover:bg-blue-700 ">
            <FaTrophy className="mr-4" size={20} />
            Leaderboard
          </div>
          <div className="flex items-center p-4 rounded hover:bg-blue-700 ">
            <FaUserCog className="mr-4" size={20} />
            Account Settings
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
