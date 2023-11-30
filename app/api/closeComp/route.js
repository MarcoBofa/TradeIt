import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import finnHub from "@/app/api/stocks/finnHub";

const fetchPrice = async (symbol) => {
  try {
    const response = await finnHub.get("/quote", {
      params: {
        symbol, // This is the symbol for the stock you want to get data for
      },
    });
    const data = {
      ...response.data,
      s: symbol,
    };

    return data.c;
  } catch (error) {
    console.log(error);
  }
};

export async function POST(req, res) {
  try {
    // 1. Identify the competition to close
    const competitionToClose = await prisma.competition.findFirst({
      where: {
        AND: [{ endDate: { lte: new Date() } }, { status: true }],
      },
      orderBy: {
        endDate: "desc",
      },
    });

    if (!competitionToClose) {
      return NextResponse.json(
        { message: "No competition to close" },
        { status: 404 }
      );
    }

    await prisma.competition.update({
      where: { id: competitionToClose.id },
      data: { status: false },
    });

    //2. Fetch participants and their stock selections
    const stockSelections = await prisma.stockSelection.findMany({
      where: {
        competitionId: competitionToClose.id,
      },
      include: {
        selections: true,
      },
    });

    const updatePromises = [];

    for (const selection of stockSelections) {
      for (const stock of selection.selections) {
        const fetchPricePromise = fetchPrice(stock.tickerSymbol)
          .then((finalPrice) => {
            return prisma.userStock.update({
              where: { id: stock.id },
              data: { finalPrice },
            });
          })
          .catch((error) => {
            console.error(
              `Error fetching price for ${stock.tickerSymbol}:`,
              error
            );
            // Handle error appropriately
          });
        updatePromises.push(fetchPricePromise);
      }
    }

    await Promise.all(updatePromises);

    // 4. Calculate total percentage change for each participant
    const results = stockSelections.map((selection) => {
      const totalChange = selection.selections.reduce((acc, stock) => {
        const change =
          ((stock.finalPrice - stock.initialPrice) / stock.initialPrice) * 100;
        return acc + change;
      }, 0);
      const avg = totalChange / selection.selections.length;
      return { userId: selection.userId, sId: selection.id, avg };
    });

    // 5. Determine winners and rankings
    results.sort((a, b) => b.avg - a.avg);

    const pointAwards = [10, 6, 4, 2, 2]; // Points for 1st, 2nd, 3rd, 4th, 5th positions

    for (let i = 0; i < results.length; i++) {
      const userId = results[i].userId;
      let points = 0;

      if (i < pointAwards.length) {
        points = pointAwards[i];
      }

      // Update user points
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points,
          },
        },
      });
    }

    console.log("Results:", results);

    const updateDb = results.map((result, index) => {
      return prisma.stockSelection.update({
        where: { id: result.sId, userId: result.userId },
        data: {
          avgChange: result.avg,
          rank: index + 1,
        },
      });
    });

    await Promise.all(updateDb);

    //console.log("Results:", updateDb);

    return NextResponse.json({ text: "ciao" }, { status: 200 });
  } catch (error) {
    console.error("Error closing competition:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
