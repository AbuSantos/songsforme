// components/MarketPlace.tsx
"use server"
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
// import Tracktable from "../musicNFTs/listedNFT/data-table";
import { Skeleton } from "../ui/skeleton";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";
import { Suspense } from "react";
import { getTimeThreshold } from "@/lib/utils";

// export const revalidate = 60; // Revalidate every 60 seconds as a fallback
type MarketPlaceProps = {
    filter: string
}
// Server Component


const MarketPlace = async ({ filter }: MarketPlaceProps) => {

    const threshHold = getTimeThreshold(filter)

    console.log(threshHold, "filtering from marketplace")

    // const filter = searchParams?.filter || "";
    const listedNFTs = await db.listedNFT.findMany({
        where: {
            sold: false,
            ...(threshHold && {
                listedAt: {
                    gte: threshHold
                }
            })
        },
        select: {
            id: true,
            tokenId: true,
            listedAt: true,
            seller: true,
            price: true,
            contractAddress: true,
            accumulatedTime: true,
            rewardRatio: true,
            isSaleEnabled: true
        },

    });


    console.log(listedNFTs, "from market")


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
