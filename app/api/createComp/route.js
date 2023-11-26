// pages/api/create-competition.js
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
    // console.log("Authorization Header:", req);
    // if (req.headers.authorization === process.env.CRON_JOB_SECRET) {
    const startDate = new Date(); // Adjust this to the beginning of the competition
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // One week later

    const competition = await prisma.competition.create({
      data: {
        startDate,
        endDate,
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
