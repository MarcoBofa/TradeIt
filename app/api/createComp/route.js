// pages/api/create-competition.js
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
    const currentDate = new Date();

    const existingCompetition = await prisma.competition.findFirst({
      where: {
        startDate: {
          lt: currentDate,
        },
        endDate: {
          gt: currentDate,
        },
        status: true,
      },
    });

    if (existingCompetition) {
      console.error("A competition is already ongoing.");
      return NextResponse.json(
        { error: "A competition is already ongoing." },
        { status: 400 }
      );
    }

    const startDate = new Date();
    let endDate = new Date(startDate.getTime() + (23 * 60 + 40) * 60 * 1000);

    // Check if today is Friday (getDay() returns 5 for Friday)
    if (startDate.getDay() === 5) {
      // If it's Friday, set the end date to Monday
      endDate = new Date(startDate.getTime() + (72 * 60 - 20) * 60 * 1000);
    }

    const competition = await prisma.competition.create({
      data: {
        startDate,
        endDate,
        status: true,
      },
    });

    console.log("Competition created:", competition);

    return NextResponse.json(
      { message: "Competition created successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
}
