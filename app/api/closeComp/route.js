import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import finnHub from "@/app/api/stocks/finnHub";

const fetchPrice = async (symbol, retries = 3, backoff = 2000) => {
  try {
    const response = await finnHub.get("/quote", {
      params: {
        symbol, // This is the symbol for the stock you want to get data for
      },
    });
    return response.data.c; // Assuming 'c' is the current price field
  } catch (error) {
    console.error("Error fetching price for symbol:", symbol, error);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchPrice(symbol, retries - 1, backoff * 2);
    }
    return null; // After all retries, if it still fails, return null
  }
};

export async function POST(req, res) {
  try {
    const competitionToClose = await prisma.competition.findFirst({
      where: {
        AND: [{ endDate: { lte: new Date() } }, { status: true }],
      },
      orderBy: { endDate: "desc" },
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

    const stockSelections = await prisma.stockSelection.findMany({
      where: { competitionId: competitionToClose.id },
      include: { selections: true },
    });

    console.log("Closing competition:", stockSelections);

    const updatePromises = stockSelections.flatMap((selection) =>
      selection.selections.map((stock) =>
        fetchPrice(stock.tickerSymbol).then((finalPrice) => {
          return prisma.userStock.update({
            where: { id: stock.id },
            data: { finalPrice },
          });
        })
      )
    );

    await Promise.all(updatePromises);

    const results = stockSelections.map((selection) => {
      const totalChange = selection.selections.reduce((acc, stock) => {
        const change =
          ((stock.finalPrice - stock.initialPrice) / stock.initialPrice) * 100;
        return acc + change;
      }, 0);
      const avgChange = totalChange / selection.selections.length;
      return {
        userId: selection.userId,
        stockSelectionId: selection.id,
        avgChange,
      };
    });

    results.sort((a, b) => b.avgChange - a.avgChange);

    console.log("Results:", results);

    const pointAwards = [10, 6, 4, 2, 2];

    for (const [index, result] of results.entries()) {
      const points = index < pointAwards.length ? pointAwards[index] : 0;
      await prisma.stockSelection.update({
        where: { id: result.stockSelectionId },
        data: { avgChange: result.avgChange, rank: index + 1 },
      });
      await prisma.user.update({
        where: { id: result.userId },
        data: { points: { increment: points } },
      });
    }

    return NextResponse.json(
      { message: "Competition closed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error closing competition:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
