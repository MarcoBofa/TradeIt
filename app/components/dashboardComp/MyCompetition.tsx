"use client";
import { safeUser } from "@/types";
import "../../globals.css";
import React, { use, useEffect, useState } from "react";
import Modal from "./competionComponents/joinModal";
import finnHub from "@/app/api/stocks/finnHub";

interface DashboardProps {
  user: safeUser;
}

interface CompetitionData {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
}

interface currentCompStocks {
  ticker: string;
  buyPrice: number;
  currentPrice?: number;
}

const MyCompetition: React.FC<DashboardProps> = ({ user }) => {
  const [competition, setCompetition] = useState<CompetitionData | null>(null);
  const [participating, setParticipating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userEntryStocks, setUserEntryStocks] = useState<currentCompStocks[]>(
    []
  );

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
    const fetchCompetition = async () => {
      try {
        const response = await fetch("/api/getCurrentComp");
        if (!response.ok) {
          throw new Error("Error fetching competition data");
        }
        const data = await response.json();
        setCompetition(data.response.competition);
        setParticipating(data.response.isEnrolled);

        if (data.response.isEnrolled) {
          const compId = data.response.competition.id;
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

    fetchCompetition();
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    return (totalChange / userEntryStocks.length).toFixed(2); // Average percentage change
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-200 w-full h-full">
      <h1 className="text-3xl font-bold mb-10">Current Ongoing Competition</h1>
      {competition && (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 pl-20 pr-20 mb-15">
          <h2 className="text-2xl font-semibold mb-10">Competition Details</h2>
          <p className="mb-4">
            <strong>Start Date:</strong> {formatDate(competition.startDate)}
          </p>
          <p className="mb-10">
            <strong>End Date:</strong> {formatDate(competition.endDate)}
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
                  <strong>Total Percentage Change:</strong>{" "}
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
              competition={competition}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MyCompetition;
