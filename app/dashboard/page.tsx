"use client";
import "../globals.css";
import React from "react";
import Sidebar from "@/app/components/dashboardComp/Sidebar";
import StockList from "../components/dashboardComp/StockList";
import SearchBar from "../components/dashboardComp/SearchBar";
import { useState } from "react";
import { watchlistProps } from "@/types";

const Dashboard: React.FC = () => {
  const [watchlist, setWatchlist] = useState([
    "MSFT",
    "AAPL",
    "TSLA",
    "PYPL",
    "ELF",
    "AMD",
  ]);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col p-4 items-center justify-center bg-gray-300">
          <h1 className="text-3xl">TEMPORARY WATCHLIST</h1>
          <SearchBar watchlist={watchlist} setWatchlist={setWatchlist} />
          <StockList watchlist={watchlist} setWatchlist={setWatchlist} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
