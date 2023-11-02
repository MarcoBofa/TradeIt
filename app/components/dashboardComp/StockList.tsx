"use client";
import { fetchData } from "next-auth/client/_utils";
import React, { useState, useEffect } from "react";
import finnHub from "@/app/api/stocks/finnHub";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";

interface StockData {
  s: string; // Stock symbol
  c: number; // Current price
  d: number; // Change
  dp: number; // Change percentage
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

const StockList: React.FC = () => {
  const [watchlist, setWatchlist] = useState([
    "MSFT",
    "AAPL",
    "TSLA",
    "PYPL",
    "ELF",
    "AMD",
  ]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = watchlist.map((symbol) =>
          finnHub
            .get("/quote", {
              params: {
                symbol,
              },
            })
            .then((response) => ({
              ...response.data,
              s: symbol,
            }))
        );

        const data = await Promise.all(promises);
        setStockData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [watchlist]);

  const changeColor = (change: number) => {
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  const renderIcon = (change: number) => {
    return change > 0 ? (
      <BsFillCaretUpFill className="inline-block ml-1" />
    ) : (
      <BsFillCaretDownFill className="inline-block ml-1" />
    );
  };

  const deleteStock = (symbol: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock !== symbol));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl">TEMPORARY WATCHLIST</h1>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Last
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Chg
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Chg%
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                High
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Low
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-white uppercase tracking-wider"
              >
                Open
              </th>
              <th
                scope="col"
                className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Pclose
              </th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => (
              <tr key={stock.s} className="hover:bg-gray-100">
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="whitespace-no-wrap">{stock.s}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                  <p className="whitespace-no-wrap">{stock.c}</p>
                </td>
                <td
                  className={`px-6 py-4 border-b border-gray-200 bg-white text-sm ${changeColor(
                    stock.d
                  )}`}
                >
                  <div className="flex items-center">
                    <span className="whitespace-no-wrap">
                      {stock.d.toFixed(2)} {renderIcon(stock.d)}
                    </span>
                  </div>
                </td>
                <td
                  className={`px-5 py-4 border-b border-gray-200 bg-white text-sm ${changeColor(
                    stock.dp
                  )}`}
                >
                  <div className="flex items-center">
                    <span className="whitespace-no-wrap">
                      {stock.dp.toFixed(2)}% {renderIcon(stock.dp)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="whitespace-no-wrap">{stock.h.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="whitespace-no-wrap">{stock.l.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="whitespace-no-wrap">{stock.o.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                  <div className="flex justify-between items-center">
                    <p className="whitespace-no-wrap">{stock.pc.toFixed(2)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStock(stock.s);
                      }}
                      className="text-white bg-red-500 hover:bg-red-700 rounded-full ml-5 px-3 py-1 text-xs focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;
