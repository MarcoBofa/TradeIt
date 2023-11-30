import "../../app/globals.css";
import React from "react";
import getUser from "../actions/getUser";

import { safeUser } from "@/types";
import PageLayout from "../components/dashboardComp/pageLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="flex items-center justify-center min-h-screen">
          <Link
            className="text-3xl hover:text-red-700 dark:text-red-500 hover:underline"
            href="/Login"
          >
            LOGIN to see Dashboard
          </Link>
        </div>
      )}
    </>
  );
}
