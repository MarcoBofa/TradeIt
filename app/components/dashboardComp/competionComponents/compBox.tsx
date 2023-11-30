"use client";
import { safeUser } from "@/types";
import "../../../globals.css";
import React, { use, useEffect, useState } from "react";
import finnHub from "@/app/api/stocks/finnHub";
import Modal from "./joinModal";
import { Stoke } from "next/font/google";

interface CompetitionData {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
  isEnrolled: boolean;
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

interface oldCompStocks {
  ticker: string;
  initialPrice: number;
  closingPrice: number;
  rank: number;
  avgChange: number;
}

const CompBox: React.FC<CompBoxProps> = ({ user, compData }) => {
  const [participating, setParticipating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [oldComp, setOldComp] = useState<boolean>(false);
  const [userEntryStocks, setUserEntryStocks] = useState<currentCompStocks[]>(
    []
  );
  const [oldCompStocks, setOldCompStocks] = useState<oldCompStocks[]>([
    {
      ticker: "",
      initialPrice: 0,
      closingPrice: 0,
      rank: 0,
      avgChange: 0,
    },
  ]);

  const fetchPrice = async (symbol: string) => {
    try {
      const response = await finnHub.get("/quote", {
        params: {
          symbol, // This is the symbol for the stock you want to get data for
        },
      });
      return response.data.c; // Assuming 'c' is the current price field
    } catch (error) {
      console.error("Error fetching price for symbol:", symbol, error);
      return null; // Handle error appropriately, null is just a placeholder
    }
  };

  useEffect(() => {
    const endDate = new Date(compData.endDate);
    const now = new Date();
    setOldComp(endDate < now);

    setParticipating(compData.isEnrolled);

    const fetchCompetition = async () => {
      try {
        if (participating) {
          const compId = compData.id;
          const compStocksResponse = await fetch(
            `/api/getCompStock?id=${compId}`
          );
          if (!compStocksResponse.ok) {
            throw new Error("Error fetching competition stocks");
          }
          const compStocksData = await compStocksResponse.json();
          const prices = await Promise.all(
            compStocksData.userStocks[0].selections.map((stock: any) =>
              fetchPrice(stock.tickerSymbol)
            )
          );
          const currentCompStocks = compStocksData.userStocks[0].selections.map(
            (stock: any, index: number) => ({
              ticker: stock.tickerSymbol,
              buyPrice: stock.initialPrice,
              currentPrice: prices[index],
            })
          );
          setUserEntryStocks(currentCompStocks);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const fetchOldCompetition = async () => {
      if (compData.isEnrolled) {
        const compId = compData.id;
        console.log("compId", compId);
        try {
          const response = await fetch(`/api/getUserOldComp?id=${compId}`);
          if (!response.ok) {
            throw new Error("Error fetching competition stocks");
          }
          const data = await response.json();
          if (data.oldCompStocks && Array.isArray(data.oldCompStocks)) {
            console.log("old comp stocks", data);
            setOldCompStocks(data.oldCompStocks);
          } else {
            throw new Error(
              "Invalid data structure for old competition stocks"
            );
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };

    if (oldComp) {
      fetchOldCompetition();
    } else {
      fetchCompetition();
    }
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
        <strong>Start Date:</strong> {formatDate(compData.startDate)}
      </p>
      <p className="mb-10">
        <strong>End Date:</strong> {formatDate(compData.endDate)}
      </p>

      {oldComp ? (
        <>
          <p
            className={`${
              participating ? "text-green-500" : "text-red-500"
            } font-semibold mb-4`}
          >
            {participating
              ? `Congrats! you positioned ${oldCompStocks[0].rank}!`
              : "Did not participate"}
          </p>
          {participating && (
            <>
              <h3 className="text-xl font-semibold mb-2">Your Stocks:</h3>
              <div className="w-full">
                {oldCompStocks.map((stock, index) => (
                  <div
                    key={stock.ticker}
                    className="flex justify-between items-center border-b-2 py-2"
                  >
                    <span className="font-medium">{stock.ticker}</span>
                    <span>{stock.initialPrice.toFixed(2)}</span>
                    <span>
                      {stock.closingPrice
                        ? stock.closingPrice.toFixed(2)
                        : "Loading..."}
                    </span>
                    <span>
                      {stock.initialPrice
                        ? (
                            ((stock.closingPrice - stock.initialPrice) /
                              stock.initialPrice) *
                            100
                          ).toFixed(2) + "%"
                        : "Calculating..."}
                    </span>
                  </div>
                ))}
                <div className="mt-4">
                  <strong>Average Percentage Change:</strong>{" "}
                  {oldCompStocks[0].avgChange.toFixed(2)}%
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
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
        </>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          competition={compData}
        />
      )}
    </div>
  );
};

export default CompBox;
