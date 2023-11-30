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
  endDate: string; // or Date
  isEnrolled: boolean;
}

interface CompBoxProps {
  user: safeUser;
  compData: competition;
}

interface oldCompStocks {
  ticker: string;
  initialPrice: number;
  closingPrice: number;
  rank: number;
  avgChange: number;
}

const OldcompBox: React.FC<CompBoxProps> = ({ user, compData }) => {
  const [participating, setParticipating] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [oldCompStocks, setOldCompStocks] = useState<oldCompStocks[]>([
    {
      ticker: "",
      initialPrice: 0,
      closingPrice: 0,
      rank: 0,
      avgChange: 0,
    },
  ]);

  useEffect(() => {
    const endDate = new Date(compData.endDate);
    const now = new Date();
    setParticipating(compData.isEnrolled);

    const fetchOldCompetition = async () => {
      if (compData.isEnrolled) {
        const compId = compData.id;
        try {
          const response = await fetch(`/api/getUserOldComp?id=${compId}`);
          if (!response.ok) {
            throw new Error("Error fetching competition stocks");
          }
          const data = await response.json();
          if (data.oldCompStocks && Array.isArray(data.oldCompStocks)) {
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

    fetchOldCompetition();
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

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 pl-20 pr-20 mb-10">
      <h2 className="text-2xl font-semibold mb-10">Competition Details</h2>
      <p className="mb-4">
        <strong>Start Date:</strong> {formatDate(compData.startDate)}
      </p>
      <p className="mb-10">
        <strong>End Date:</strong> {formatDate(compData.endDate)}
      </p>
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

export default OldcompBox;
