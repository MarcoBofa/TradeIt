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
      const userStocks = await prisma.stockSelection.findMany({
        where: {
          competitionId: competitionId,
          userId: currentUser.id,
        },
        include: {
          selections: true,
        },
      });

      // Transform userStocks to the desired format
      const oldCompStocks = userStocks
        .map((stockSelection: any) => {
          return stockSelection.selections.map((userStock: any) => {
            return {
              ticker: userStock.tickerSymbol,
              initialPrice: userStock.initialPrice,
              closingPrice: userStock.finalPrice, // Assuming this is how you have the final price
              rank: stockSelection.rank, // Assuming rank is stored at the stockSelection level
              avgChange: stockSelection.avgChange, // Same assumption as rank
            };
          });
        })
        .flat(); // Flatten the array since map will return an array of arrays

      return NextResponse.json({ oldCompStocks }, { status: 200 });
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
