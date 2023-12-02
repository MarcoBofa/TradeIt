"use client";
import "../../globals.css";
import React, { useEffect } from "react";
import Sidebar from "@/app/components/dashboardComp/Sidebar";
import { useState } from "react";
import { watchlistProps } from "@/types";
import SearchBar from "./SearchBar";
import StockList from "./StockList";
import { safeUser } from "@/types";
import prisma from "@/app/libs/prismadb";
import axios from "axios";

interface DashboardProps {
  user: safeUser;
}

// Other imports remain the same

const MainComponent: React.FC<DashboardProps> = ({ user }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/getWatchlist?userId=${user.id}`);
          const data = await response.json();

          setWatchlist(
            data.stockSymbols || ["MSFT", "AAPL", "TSLA", "PYPL", "AMD"]
          );
        } catch (error) {
          setWatchlist(["MSFT", "AAPL", "TSLA", "PYPL", "AMD"]);
        }
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-1 flex-col p-4 items-center justify-center bg-gray-300">
      <h1 className="text-3xl">WATCHLIST</h1>
      <SearchBar watchlist={watchlist} setWatchlist={setWatchlist} />
      <StockList watchlist={watchlist} setWatchlist={setWatchlist} />
    </div>
  );
};

export default MainComponent;
