// app/api/watchlist/route.ts
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
    const userWatchlist = await prisma.watchlist.findUnique({
      where: { userId: currentUser.id },
    });
    return NextResponse.json({ userWatchlist }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await request.json();
  const { watchlist } = body;
  try {
    const result = await prisma.watchlist.upsert({
      where: {
        userId: currentUser.id,
      },
      update: {
        stockSymbols: watchlist,
      },
      create: {
        userId: currentUser.id,
        stockSymbols: watchlist,
      },
    });
    return NextResponse.json({ success: "Watchlist updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating watchlist" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextApiRequest) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { symbol } = request.query; // Access the symbol from the query parameters

  try {
    const userWatchlist = await prisma.watchlist.findUnique({
      where: { userId: currentUser.id },
    });

    //console.log(userWatchlist);
    if (userWatchlist) {
      const updatedWatchlist = userWatchlist.stockSymbols.filter(
        (s) => s !== symbol
      );
      //console.log(updatedWatchlist);
      const result = await prisma.watchlist.upsert({
        where: {
          userId: currentUser.id,
        },
        update: {
          stockSymbols: updatedWatchlist,
        },
        create: {
          userId: currentUser.id,
          stockSymbols: updatedWatchlist,
        },
      });
      return NextResponse.json(
        { success: "Removed from Watchlist!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error removing stock" },
      { status: 500 }
    );
  }
}
