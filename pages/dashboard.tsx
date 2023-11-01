import "../app/globals.css";
import React from "react";
import Footer from "@/app/components/footer";
import Sidebar from "@/app/components/dashboardComp/Sidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 h-full">
        <Sidebar />
        <div className="flex flex-1 p-4 items-center justify-center bg-gray-300">
          <h1 className="text-3xl">Welcome to your dashboard!</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
