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

    const pastCompetitions = await prisma.competition.findMany({
      where: {
        endDate: {
          lt: currentDate,
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });

    console.log("past comps", pastCompetitions);

    const comps = await Promise.all(
      pastCompetitions.map(async (competition) => {
        const participation = await prisma.stockSelection.findFirst({
          where: {
            competitionId: competition.id,
            userId: currentUser.id,
          },
        });

        return {
          id: competition.id,
          startDate: competition.startDate,
          endDate: competition.endDate,
          participates: !!participation, // Convert to boolean: true if participated, false otherwise
        };
      })
    );

    //console.log("compppppp dataaaaaa", comps);
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
    return NextResponse.json({ comps }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching watchlist" },
      { status: 500 }
    );
  }
}
