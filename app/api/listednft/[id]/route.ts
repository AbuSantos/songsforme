import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch activities for a given user
export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  const { id } = params;

  // Check if user ID is provided
  if (!id) {
    return new NextResponse(JSON.stringify({ message: "UserId is required" }), {
      status: 400,
    });
  }

  try {
    const nftBid = await db.listedNFT.findMany({
      where: {
        seller: id,
      },
      select: {
        id: true,
        tokenId: true,
        sold: true,
        contractAddress: true,
        Bid: {
          select: {
            owner: {
              select: {
                username: true,
                userId: true,
                email: true,
              },
            },
            bidAmount: true,
          },
        },
        Single: {
          select: {
            artist_name: true,
            song_cover: true,
            song_name: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify({ data: nftBid }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);

    return new NextResponse(
      JSON.stringify({ message: "Error fetching activities", error }),
      { status: 500 }
    );
  }
};
