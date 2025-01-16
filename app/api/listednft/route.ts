import { db } from "@/lib/db";
import { isEthereumAddress } from "@/lib/helper";
import { getTimeThreshold } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const ITEMS_PER_PAGE = 15;

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  // Extract parameters
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const query = searchParams.get("query")?.trim();
  const filter = searchParams.get("filter");

  try {
    // Ensure indexes are created on frequently queried fields
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS idx_contractAddress ON ListedNFT (contractAddress)`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS idx_seller ON ListedNFT (seller)`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS idx_song_name ON Single (song_name)`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS idx_artist_name ON Single (artist_name)`;

    // Build where clause
    const whereClause: Prisma.ListedNFTWhereInput = { sold: false };
    const orConditions: Prisma.ListedNFTWhereInput[] = [];

    //if the query is an address, we conduct a search first with the the contract address or the sellers address
    if (query) {
      if (isEthereumAddress(query)) {
        orConditions.push(
          {
            contractAddress: {
              equals: query.toLowerCase(),
              mode: "insensitive",
            },
          },
          { seller: { equals: query.toLowerCase(), mode: "insensitive" } }
        );
      }
      orConditions.push(
        { Single: { song_name: { contains: query, mode: "insensitive" } } },
        { Single: { artist_name: { contains: query, mode: "insensitive" } } }
      );
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

    // Handle time-based filters
    if (filter) {
      const threshold = getTimeThreshold(filter);
      if (threshold) {
        whereClause.listedAt = { gte: threshold };
      }
    }

    // Sorting logic
    const orderBy: Prisma.ListedNFTOrderByWithRelationInput =
      filter === "ratio"
        ? { rewardRatio: "desc" }
        : filter === "playtime"
        ? { totalAccumulatedTime: "desc" }
        : { listedAt: "desc" };

    // Fetch data
    const listedData = await db.listedNFT.findMany({
      where: whereClause,
      orderBy,
      select: {
        id: true,
        tokenId: true,
        listedAt: true,
        seller: true,
        price: true,
        contractAddress: true,
        accumulatedTime: true,
        totalAccumulatedTime: true,
        rewardRatio: true,
        isSaleEnabled: true,
        Single: {
          select: {
            song_name: true,
            artist_name: true,
            song_cover: true,
            genre: true,
          },
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    // Get total count
    const total = await db.listedNFT.count({ where: whereClause });

    return NextResponse.json({
      data: listedData,
      metadata: {
        total,
        page,
        pageSize: ITEMS_PER_PAGE,
        pageCount: Math.ceil(total / ITEMS_PER_PAGE),
        hasNextPage: page * ITEMS_PER_PAGE < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching listed NFTs:", error);
    return NextResponse.json(
      { error: "Failed to fetch listed NFTs" },
      { status: 500 }
    );
  }
};
