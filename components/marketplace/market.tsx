// components/MarketPlace.tsx
"use server"
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
// import Tracktable from "../musicNFTs/listedNFT/data-table";
import { Skeleton } from "../ui/skeleton";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";
import { Suspense } from "react";

// export const revalidate = 60; // Revalidate every 60 seconds as a fallback

// Server Component
const MarketPlace = async () => {
    // const filter = searchParams?.filter || "";

    // Fetch data from database directly
    const listedNFTs = await db.listedNFT.findMany({
        where: { sold: false },
        select: {
            id: true,
            tokenId: true,
            seller: true,
            price: true,
            contractAddress: true,
            accumulatedTime: true,
            rewardRatio: true,
            isSaleEnabled: true
        },
    });

    console.log(listedNFTs)

    revalidateTag("bought")

    if (!listedNFTs.length) {
        return <MarketSkeleton />;
    }

    return (
        <div className="w-full">
            {/* @ts-ignore */}
            <Tracktable data={listedNFTs} />
        </div>
    );
};

export default MarketPlace;
