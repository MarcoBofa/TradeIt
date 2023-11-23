import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  try {
    console.log("userSession");
    const session = await getServerSession(req, res, authOptions);
    console.log(session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
      return;
    }

    return NextResponse.json(
      {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
        updatedAt: currentUser.updatedAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
