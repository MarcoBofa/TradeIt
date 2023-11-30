"use client";
import React, { useState, useEffect, useContext } from "react";
import finnHub from "@/app/api/stocks/finnHub"; // Adjust path as needed
import { watchlistProps } from "@/types";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RingLoader } from "react-spinners";
import { set } from "react-hook-form";
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
    if (watchlist.find((item) => item === stock)) {
      toast.error("Stock already in watchlist");
      return;
    }

    if (stock.includes(".")) {
      toast.error("Stock symbols with a period are not allowed");
      return;
    }

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
            <RingLoader color="#0A2E29" />
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
