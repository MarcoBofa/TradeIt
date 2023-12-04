// pages/api/create-competition.js
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
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

    // If there is an existing competition, return an error response
    if (existingCompetition) {
      console.error("A competition is already ongoing.");
      return NextResponse.json(
        { error: "A competition is already ongoing." },
        { status: 400 }
      );
    }
    // console.log("Authorization Header:", req);
    // if (req.headers.authorization === process.env.CRON_JOB_SECRET) {
    const startDate = new Date(); // Adjust this to the beginning of the competition
    const endDate = new Date(startDate.getTime() + (23 * 60 + 40) * 60 * 1000); // One week later

    const competition = await prisma.competition.create({
      data: {
        startDate,
        endDate,
        status: true,
        // other fields
      },
    });

    console.log("Competition created", startDate);

    return NextResponse.json({ text: "ciao" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  //   } else {
  //     // Handle any other HTTP methods
  //     return NextResponse.json({ error: "Not Allowed" }, { status: 405 });
  //   }
}
