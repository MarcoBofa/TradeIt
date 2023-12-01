import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import finnHub from "@/app/api/stocks/finnHub";

const fetchPrice = async (symbol) => {
  try {
    const response = await finnHub.get("/quote", {
      params: { symbol },
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
