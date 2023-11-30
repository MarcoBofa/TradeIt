import "../../app/globals.css";
import React from "react";
import getUser from "../actions/getUser";

import { safeUser } from "@/types";
import PageLayout from "../components/dashboardComp/pageLayout";

interface DashboardProps {
  user: safeUser;
}

export default async function Dashboard() {
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
