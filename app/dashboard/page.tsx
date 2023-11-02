import "../globals.css";
import React from "react";
import Sidebar from "@/app/components/dashboardComp/Sidebar";
import StockList from "../components/dashboardComp/StockList";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 h-full">
        <Sidebar />
        <div className="flex flex-1 p-4 items-center justify-center bg-gray-300">
          <StockList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
