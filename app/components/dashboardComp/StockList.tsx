"use client";
import { fetchData } from "next-auth/client/_utils";
import React, { useState, useEffect } from "react";
import finnHub from "@/app/api/stocks/finnHub";

const StockList: React.FC = () => {
  const [watchlist, setWatchlist] = useState(["MSFT", "AAPL", "TSLA"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await finnHub.get(
          `/quote?symbol=MSFT&token=${process.env.FINNHUB_TOKEN}`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 p-4 items-center justify-center bg-gray-300">
      <h1 className="text-3xl">Stocklist</h1>
    </div>
  );
};

export default StockList;
