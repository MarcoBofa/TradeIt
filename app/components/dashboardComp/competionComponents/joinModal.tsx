// ModalComponent.jsx
import finnHub from "@/app/api/stocks/finnHub";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";

interface CompetitionData {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
  userIds?: string[];
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  competition: CompetitionData;
}

interface Result {
  description: string;
  symbol: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, competition }) => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  if (!isOpen) return null;

  const addStock = (stock: string) => {
    if (selectedStocks.length >= 3) {
      toast.error("You can only select 3 stocks");
      setSearch("");
      return;
    }

    if (stock.includes(".")) {
      toast.error("Stock symbols with a period are not allowed");
      return;
    }

    if (!selectedStocks.includes(stock)) {
      setSelectedStocks([...selectedStocks, stock]);
    }

    console.log(stock);
    setSearch("");
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

  const deleteStock = (symbol: string) => {
    setSelectedStocks((prev) => prev.filter((stock) => stock !== symbol));
  };

  const submitEntry = () => {
    if (selectedStocks.length !== 3) {
      toast.error("You must select 3 stocks");
      return;
    }
    const data = {
      stocks: selectedStocks,
      compData: competition,
    };
    axios
      .post("/api/joinComp", { data: data })
      .then(() => {
        toast.success("Competition Joined! Good Luck!");
        closeModal();
        setSearch("");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="flex flex-col items-center relative top-20 mx-auto p-5 border w-[700px] shadow-lg rounded-md bg-white">
        <h1 className="text-2xl font-semibold mb-5">
          Select 3 Different Stock to enter the competition!
        </h1>
        <div className="relative">
          <input
            id="search"
            type="text"
            className="form-input w-[500px] rounded p-2 bg-gray-300 focus:bg-gray-200 focus:outline-none focus:border-blue-500"
            placeholder="Search"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {renderDropdown()}
        </div>
        {/* You can add a title or controls here */}
        <div className="mt-2 px-7 py-3 text-2xl">
          <ol className="list-decimal pl-5 mt-5 ">
            {selectedStocks.map((stock, index) => (
              <>
                <div className="flex justify-between mb-3 ">
                  <li className="" key={stock}>
                    {" "}
                    {stock}
                  </li>{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStock(stock);
                    }}
                    className="text-white bg-red-500 hover:bg-red-700 rounded-full ml-10 px-3 py-1 text-xs focus:outline-none"
                  >
                    X
                  </button>
                </div>
              </>
            ))}
          </ol>
        </div>
        <div className="flex flex-row items-center mt-10 px-4 py-3">
          <button
            id="close-btn"
            onClick={closeModal}
            className="px-4 py-2 mr-[50px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
          <button
            id="close-btn"
            onClick={() => submitEntry()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
