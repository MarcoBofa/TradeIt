import "../../app/globals.css";
import React from "react";
import Sidebar from "@/app/components/dashboardComp/Sidebar";
import { watchlistProps } from "@/types";
import MainComponent from "../components/dashboardComp/MainContent";
import getUser from "../actions/getUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

import { safeUser } from "@/types";
import PageLayout from "../components/dashboardComp/pageLayout";

interface DashboardProps {
  user: safeUser;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const currentUser = await getUser();

  // if (currentUser) {
  //   const userWatchlist = await prisma.watchlist.findUnique({
  //     where: { userId: currentUser.id },
  //   });

  //   console.log(userWatchlist);
  // }

  return (
    <>
      {currentUser ? (
        <PageLayout user={currentUser} />
      ) : (
        <div>No user data</div>
      )}
    </>
  );
}
