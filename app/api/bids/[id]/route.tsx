import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Assuming you're using Prisma or a similar ORM

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Parse query parameters
    const url = new URL(request.url);
    const nftAddress = url.searchParams.get("nftAddress");

    // Input validation
    if (!id || !nftAddress) {
        return NextResponse.json(
            { error: "Missing or invalid tokenId or nftAddress" },
            { status: 400 }
        );
    }

    try {
        // Fetch bids from the database
        const bids = await db.bid.findMany({
            where: {
                tokenId: id,
                nftAddress: nftAddress,
                status: {
                    in: ["PENDING", "WIN"],
                },
            },
            orderBy: {
                bidAmount: "desc",
            },
        });

        // Return success response
        return NextResponse.json({
            success: true,
            data: bids,
            totalCount: bids.length,
        });
    } catch (error) {
        console.error("Error fetching bids:", { id, nftAddress, error });

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
