"use client";
import React, { useState, useEffect, useContext } from "react";
import finnHub from "@/app/api/stocks/finnHub"; // Adjust path as needed
import { watchlistProps } from "@/types";
import axios from "axios";
import { toast } from "react-hot-toast";
//import { useRouter } from "next/router";

interface Result {
  description: string;
  symbol: string;
}

const SearchBar: React.FC<watchlistProps> = ({ watchlist, setWatchlist }) => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  //const router = useRouter();

  const addStock = (stock: string) => {
    const updatedWatchlist = [...watchlist, stock];
    setWatchlist(updatedWatchlist);

    axios
      .post("/api/watchlist", { watchlist: updatedWatchlist })
      .then(() => {
        console.log("Added to watchlist");

        setSearch("");
      })
      .catch((error) => {
        toast.error(error.message);
      });

    return updatedWatchlist;
  };

  const renderDropdown = () => {
    const dropDownClass = search ? "block" : "hidden";

    return (
      <div
        className={`relative ${dropDownClass} h-64 overflow-y-scroll overflow-x-hidden cursor-pointer`}
      >
        {search && !results.length ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12c0 1.66.337 3.223.94 4.609l1.7-1.7a9 9 0 1 1 12.72 0l1.7 1.7c.603-1.386.94-3.05.94-4.609 0-5.523-4.477-10-10-10z"
              ></path>
            </svg>
          </div>
        ) : (
          <ul className="absolute w-full bg-white shadow-md rounded mt-1">
            {results.map((result) => (
              <li
                key={result.symbol}
                className="p-2 hover:bg-gray-200"
                onClick={() => addStock(result.symbol)}
              >
                {result.description} ({result.symbol})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await finnHub.get("/search", {
          params: {
            q: search,
          },
        });

        if (isMounted) {
          setResults(response.data.result);
        }
      } catch (err) {}
    };

    if (search.length > 0) {
      fetchData();
    } else {
      setResults([]);
    }

    return () => {
      isMounted = false;
    };
  }, [search]);

  return (
    <div className="w-1/2 p-5 rounded mx-auto">
      <div className="relative">
        <input
          id="search"
          type="text"
          className="form-input w-full rounded p-2 bg-gray-200 focus:bg-white focus:outline-none focus:border-blue-500"
          placeholder="Search"
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {renderDropdown()}
      </div>
    </div>
  );
};

export default SearchBar;
