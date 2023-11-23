import prisma from "@/app/libs/prismadb";

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    const userWatchlist = await prisma.watchlist.findUnique({
      where: { userId },
    });
    console.log(userWatchlist);
    res.status(200).json(userWatchlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watchlist" });
  }
}
