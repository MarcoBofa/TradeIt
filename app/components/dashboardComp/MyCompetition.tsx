"use client";
import { safeUser } from "@/types";
import "../../globals.css";
import React, { use, useEffect, useState } from "react";
import CompBox from "./competionComponents/compBox";
import { StockSelection } from "@prisma/client";
import OldcompBox from "./competionComponents/oldcompBox";

interface DashboardProps {
  user: safeUser;
}

interface competition {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
}

interface CompetitionData {
  competition: competition;
  isEnrolled: boolean;
  stockSelections: StockSelection[];
}

interface OldCompetitionData {
  id: string;
  startDate: string; // or Date, depending on how you're receiving it
  endDate: string; // or Date
  participates: boolean;
}

const MyCompetition: React.FC<DashboardProps> = ({ user }) => {
  const [oldComps, setOldComps] = useState<OldCompetitionData[]>([]);
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
        setOldComps(data.comps);
        console.log("old commmmps", data.comps);
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
      <div className="flex flex-row items-center justify-start overflow-x-auto p-4 bg-gray-300 w-full space-x-10">
        {oldComps.length > 0 ? (
          oldComps.map((comp) => (
            <div
              key={comp.id}
              className="flex-none" // flex-none prevents the boxes from shrinking
            >
              <OldcompBox
                user={user}
                compData={{ ...comp, isEnrolled: comp.participates }}
              />
            </div>
          ))
        ) : (
          <p className="text-2xl text-red-500 bg-red-200 w-full text-center">
            No past competitions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyCompetition;
