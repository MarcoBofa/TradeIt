import "../globals.css";
import React from "react";
import Footer from "@/app/components/footer";
import Sidebar from "@/app/components/dashboardComp/Sidebar";
import Navbar from "@/app/components/Navbar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 h-full">
        <Sidebar />
        <div className="flex flex-1 p-4 items-center justify-center bg-gray-300">
          <h1 className="text-3xl">
            Unfortunately i didn&rsquo;t have time to implement the selection on
            stocks because i lost a lot of time implementing the UI that i know
            is not necessary but still i wanted to do and the authentication in
            next (more difficult than i was expecting) :c (to go back click on
            logo in footer)
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
