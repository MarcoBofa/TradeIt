import { NextApiRequest, NextApiResponse } from "next";
import getUser from "@/app/actions/getUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const currentDate = new Date();

    // Fetch the current competition
    const currentCompetition = await prisma.competition.findFirst({
      where: {
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
    });

    if (currentCompetition) {
      // Check if the user is enrolled in the current competition
      const userEnrollment = await prisma.stockSelection.findFirst({
        where: {
          competitionId: currentCompetition.id,
          userId: currentUser.id,
        },
        include: {
          selections: true,
        },
      });

      //   const competitionParticipants = await prisma.stockSelection.findMany({
      //     where: {
      //       competitionId: currentCompetition.id,
      //     },
      //     include: {
      //       user: true, // Include the related user data
      //     },
      //   });

      //   console.log("Current competition:");
      //   console.log(competitionParticipants);

      // Prepare the response object
      const response = {
        competition: currentCompetition,
        isEnrolled: !!userEnrollment,
        stockSelections: userEnrollment ? userEnrollment.selections : null,
      };
      return NextResponse.json({ response }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No competition found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching watchlist" },
      { status: 500 }
    );
  }
}
