"use client";
import React, { useState, useEffect, useContext } from "react";
import finnHub from "@/app/api/stocks/finnHub"; // Adjust path as needed
import { watchlistProps } from "@/types";

interface Result {
  description: string;
  symbol: string;
}

const SearchBar: React.FC<watchlistProps> = ({ watchlist, setWatchlist }) => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  const renderDropdown = () => {
    const dropDownClass = search ? "block" : "hidden";
    return (
      <ul
        className={`list-reset ${dropDownClass} h-64 overflow-y-scroll overflow-x-hidden cursor-pointer`}
      >
        {results.map((result) => {
          return (
            <li
              key={result.symbol}
              className="p-2 hover:bg-gray-200"
              onClick={() => {
                setWatchlist([...watchlist, result.symbol]);
                setSearch("");
              }}
            >
              {result.description} ({result.symbol})
            </li>
          );
        })}
      </ul>
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
