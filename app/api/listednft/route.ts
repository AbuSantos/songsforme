import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getTimeThreshold, getAddressOrName } from "@/lib/utils";
import { isEthereumAddress } from "@/lib/helper";

const ITEMS_PER_PAGE = 15;

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  // Extract parameters
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query");
  const filter = searchParams.get("filter");

  console.log(query, "search query");

  try {
    // Build where clause
    const whereClause: Prisma.ListedNFTWhereInput = {
      sold: false,
    };

    // Handle search query
    if (query) {
      if (isEthereumAddress(query)) {
        whereClause.OR = [
          {
            contractAddress: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            seller: {
              contains: query.toLowerCase(),
              mode: "insensitive",
            },
          },
        ];
      }
      whereClause.OR = [
        {
          Single: {
            song_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          Single: {
            artist_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Handle time-based filters
    if (filter) {
      const threshold = getTimeThreshold(filter);
      if (threshold) {
        whereClause.listedAt = {
          gte: threshold,
        };
      }
    }

    // Handle sorting
    let orderBy: Prisma.ListedNFTOrderByWithRelationInput = {};
    if (filter === "ratio") {
      orderBy = { rewardRatio: "desc" };
    } else if (filter === "playtime") {
      orderBy = { totalAccumulatedTime: "desc" };
    } else {
      orderBy = { listedAt: "desc" };
    }

    // Execute query
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

    // Get total count for pagination
    const total = await db.listedNFT.count({
      where: whereClause,
    });

    return NextResponse.json({
      data: listedData,
      metadata: {
        total,
        page,
        pageSize: ITEMS_PER_PAGE,
        pageCount: Math.ceil(total / ITEMS_PER_PAGE),
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
