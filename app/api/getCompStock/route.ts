import getUser from "@/app/actions/getUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const url = request.nextUrl;
    const competitionId = url.searchParams.get("id");

    if (competitionId) {
      //console.log(competitionId);
      const userStocks = await prisma.stockSelection.findMany({
        where: {
          competitionId: competitionId,
          userId: currentUser.id,
        },
        include: {
          selections: true, // This includes the UserStocks related to the StockSelection
        },
      });

      return NextResponse.json({ userStocks }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "invalid Competition ID" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching watchlist" },
      { status: 500 }
    );
  }
}
