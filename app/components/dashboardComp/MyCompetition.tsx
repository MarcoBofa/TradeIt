"use client";
import { safeUser } from "@/types";
import "../../globals.css";
import React, { use, useEffect, useState } from "react";
import CompBox from "./competionComponents/compBox";
import { StockSelection } from "@prisma/client";

interface DashboardProps {
  user: safeUser;
}

interface competition {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
  isEnrolled: boolean;
}

interface CompetitionData {
  competition: competition;
  compStocks: StockSelection[];
}

interface OldCompetitionData {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
  participates: boolean;
}

const MyCompetition: React.FC<DashboardProps> = ({ user }) => {
  const [oldComps, setOldComps] = useState<CompetitionData[]>([]);
  const [competition, setCompetition] = useState<CompetitionData>();
  const [participating, setParticipating] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch("/api/getCurrentComp");
        if (!response.ok) {
          throw new Error("Error fetching competition data");
        }
        const data = await response.json();
        console.log("newww commmmps", data);
        setCompetition(data.response);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const fetchOldComps = async () => {
      try {
        const response = await fetch("/api/getOldComps");
        if (!response.ok) {
          throw new Error("Error fetching Old competition data");
        }

        const data = await response.json();
        const convertedData: CompetitionData[] = data.comps.map(
          (comp: OldCompetitionData) => ({
            competition: {
              id: comp.id,
              startDate: comp.startDate,
              endDate: comp.endDate,
              isEnrolled: comp.participates,
            },
            compStocks: [], // This assumes that you want an empty array for compStocks
          })
        );
        console.log("old commmmps", convertedData);
        setOldComps(convertedData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCompetition();
    fetchOldComps();
  }, [user]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-200 w-full">
      <h1 className="text-3xl font-bold mb-10">Current Ongoing Competition</h1>
      {competition && <CompBox user={user} compData={competition} />}
      <h1 className="text-3xl font-bold mb-10">Past competitions</h1>
      <div className="flex flex-row items-center justify-center p-4 bg-gray-300 w-full">
        {oldComps.length > 0 ? (
          oldComps.map((comp) => (
            <div
              key={comp.competition.id}
              className="flex items-center justify-center mr-10"
            >
              <CompBox user={user} compData={comp} />
            </div>
          ))
        ) : (
          <p className="flex justify-center mt-10 text-2xl text-red-500 bg-red-200 w-[700px]">
            No past competitions found.
          </p> // Or any other fallback component or null if you don't want to render anything
        )}
      </div>
    </div>
  );
};

export default MyCompetition;
