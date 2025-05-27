import { db } from "@/lib/db";
import { isEthereumAddress } from "@/lib/helper";
import { getTimeThreshold } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 5;
// const ITEMS_PER_PAGE = 15;  //Change to 15 for production

const buildWhereClause = (query?: string | null, filter?: string | null) => {
  const whereClause: Prisma.ListedNFTWhereInput = { sold: false };

  if (query) {
    if (isEthereumAddress(query)) {
      whereClause.OR = [
        {
          contractAddress: { equals: query.toLowerCase(), mode: "insensitive" },
        },
        { seller: { equals: query.toLowerCase(), mode: "insensitive" } },
      ];
    } else {
      whereClause.OR = [
        { Single: { song_name: { contains: query, mode: "insensitive" } } },
        { Single: { artist_name: { contains: query, mode: "insensitive" } } },
      ];
    }
  }

  if (filter) {
    const threshold = getTimeThreshold(filter);
    if (threshold) {
      whereClause.listedAt = { gte: threshold };
    }
  }

  return whereClause;
};

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const query = searchParams.get("query")?.trim();
  const filter = searchParams.get("filter");
  const cursor = searchParams.get("cursor");

  try {
    const whereClause = buildWhereClause(query, filter);

    const [listedData, total] = await Promise.all([
      db.listedNFT.findMany({
        where: whereClause,
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
        orderBy: [{ listedAt: "desc" }, { id: "desc" }],
        ...(cursor
          ? {
              skip: 1,
              cursor: { id: cursor },
            }
          : {
              skip: (page - 1) * ITEMS_PER_PAGE,
            }),
        take: ITEMS_PER_PAGE,
      }),
      db.listedNFT.count({ where: whereClause }),
    ]);

    const nextCursor = listedData[ITEMS_PER_PAGE - 1]?.id;

    return NextResponse.json(
      {
        data: listedData,
        metadata: {
          total,
          page,
          pageSize: ITEMS_PER_PAGE,
          pageCount: Math.ceil(total / ITEMS_PER_PAGE),
          hasNextPage: page * ITEMS_PER_PAGE < total,
          hasPreviousPage: page > 1,
          nextCursor,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching listed NFTs:", error);
    return NextResponse.json(
      { error: "Failed to fetch listed NFTs" },
      { status: 500 }
    );
  }
};
