import getUser from "@/app/actions/getUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    // Fetch all users with their points
    const users = await prisma.user.findMany({
      select: {
        id: true, // Doesn't select the id
        name: true, // Selects the user id
        points: true, // Selects the points
      },
      orderBy: {
        points: "desc", // Orders by points in descending order
      },
    });

    // Transform the data into the desired format
    const usersWithPoints = users.map((user) => ({
      id: user.id,
      name: user.name,
      points: user.points,
    }));

    // Return the array of users with points
    return NextResponse.json(usersWithPoints, { status: 200 });
  } catch (error) {
    console.error("Error fetching users with points:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
