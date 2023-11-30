import { NextApiRequest, NextApiResponse } from "next";
import getUser from "@/app/actions/getUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import finnHub from "@/app/api/stocks/finnHub";

const fetchPrice = async (symbol: string) => {
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

    console.log(data.c);
    return data.c;
  } catch (error) {
    console.log(error);
  }
};

export async function POST(request: Request) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data } = body;
    const { compData, stocks } = data;

    const present = await prisma.stockSelection.findFirst({
      where: {
        competitionId: compData.id,
        userId: currentUser.id,
      },
    });

    if (present) {
      return NextResponse.json(
        { error: "You have already joined this competition" },
        { status: 400 }
      );
    }
    const prices = await Promise.all(
      stocks.map((stockSymbol: string) => fetchPrice(stockSymbol))
    );

    const selections = stocks.map((stockSymbol: string, index: number) => ({
      tickerSymbol: stockSymbol,
      initialPrice: prices[index],
    }));

    const stockSelection = await prisma.stockSelection.create({
      data: {
        competitionId: compData.id,
        userId: currentUser.id,
        selections: {
          create: selections,
        },
      },
      include: {
        selections: true, // This will return the nested UserStocks if they are created
      },
    });

    return NextResponse.json({ message: "Joined" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
