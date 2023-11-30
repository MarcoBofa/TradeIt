"use client";
import { safeUser } from "@/types";
import "../../../globals.css";
import React, { use, useEffect, useState } from "react";
import finnHub from "@/app/api/stocks/finnHub";
import Modal from "./joinModal";
import { Stoke } from "next/font/google";
import { StockSelection } from "@prisma/client";

interface competition {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Dat
}

interface CompetitionData {
  competition: competition;
  isEnrolled: boolean;
  stockSelections: StockSelection[];
}

interface CompBoxProps {
  user: safeUser;
  compData: CompetitionData;
}

interface currentCompStocks {
  ticker: string;
  buyPrice: number;
  currentPrice?: number;
}

const CompBox: React.FC<CompBoxProps> = ({ user, compData }) => {
  const [participating, setParticipating] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userEntryStocks, setUserEntryStocks] = useState<currentCompStocks[]>(
    []
  );

  const fetchPrice = async (
    symbol: string,
    retries = 3,
    backoff = 2000
  ): Promise<number | null> => {
    try {
      const response = await finnHub.get("/quote", {
        params: {
          symbol, // This is the symbol for the stock you want to get data for
        },
      });
      return response.data.c; // Assuming 'c' is the current price field
    } catch (error) {
      console.error("Error fetching price for symbol:", symbol, error);
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return fetchPrice(symbol, retries - 1, backoff * 2);
      }
      return null; // After all retries, if it still fails, return null
    }
  };

  useEffect(() => {
    setParticipating(compData.isEnrolled);
    const fetchCompetition = async () => {
      try {
        if (participating) {
          const compId = compData.competition.id;
          const prices = await Promise.all(
            compData.stockSelections.map((stock: any) =>
              fetchPrice(stock.tickerSymbol)
            )
          );
          const currentCompStocks = compData.stockSelections.map(
            (stock: any, index: number) => ({
              ticker: stock.tickerSymbol,
              buyPrice: stock.initialPrice,
              currentPrice: prices[index] || 0,
            })
          );
          setUserEntryStocks(currentCompStocks);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCompetition();
  }, [compData]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalPercentageChange = () => {
    const totalChange = userEntryStocks.reduce((acc, stock) => {
      const change = stock.currentPrice
        ? ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100
        : 0;
      return acc + change;
    }, 0);

    const averageChange = (totalChange / userEntryStocks.length).toFixed(2); // Average percentage change
    return averageChange;
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 pl-20 pr-20 mb-10">
      <h2 className="text-2xl font-semibold mb-10">Competition Details</h2>
      <p className="mb-4">
        <strong>Start Date:</strong>{" "}
        {formatDate(compData.competition.startDate)}
      </p>
      <p className="mb-10">
        <strong>End Date:</strong> {formatDate(compData.competition.endDate)}
      </p>
      {participating ? (
        <>
          <p className="text-green-500 font-semibold mb-4">
            You are participating!
          </p>
          <h3 className="text-xl font-semibold mb-2">Your Stocks:</h3>
          <div className="w-full">
            {userEntryStocks.map((stock, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b-2 py-2"
              >
                <span className="font-medium">{stock.ticker}</span>
                <span>{stock.buyPrice.toFixed(2)}</span>
                <span>
                  {stock.currentPrice
                    ? stock.currentPrice.toFixed(2)
                    : "Loading..."}
                </span>
                <span>
                  {stock.currentPrice
                    ? (
                        ((stock.currentPrice - stock.buyPrice) /
                          stock.buyPrice) *
                        100
                      ).toFixed(2) + "%"
                    : "Calculating..."}
                </span>
              </div>
            ))}
            <div className="mt-4">
              <strong>Average Percentage Change:</strong>{" "}
              {calculateTotalPercentageChange()}%
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Click to Join!
        </button>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          competition={compData.competition}
        />
      )}
    </div>
  );
};

export default CompBox;
