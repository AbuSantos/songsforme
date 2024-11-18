// components/MarketPlace.tsx
"use server"
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
// import Tracktable from "../musicNFTs/listedNFT/data-table";
import { Skeleton } from "../ui/skeleton";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";
import { Suspense } from "react";
import { getAddressOrName, getTimeThreshold } from "@/lib/utils";

// export const revalidate = 60; // Revalidate every 60 seconds as a fallback
type MarketPlaceProps = {
    filter?: string
}
// Server Component

// Helper: Build query filters dynamically
const buildQueryFilters = (filter: string | undefined) => {
    //@ts-ignore
    const threshHold = getTimeThreshold(filter);
    //@ts-ignore
    const { address } = getAddressOrName(filter);

    const whereFilters = {
        sold: false,
        ...(threshHold && { listedAt: { gte: threshHold } }),
        ...(address && { contractAddress: address }),
    };

    const orderBy = filter === "ratio"
        ? { rewardRatio: "desc" as const }
        : filter === "playtime"
            ? { totalAccumulatedTime: "asc" as const }
            : undefined;

    return { whereFilters, orderBy };
};


const MarketPlace = async ({ filter }: MarketPlaceProps) => {
    //@ts-ignore
    const { whereFilters, orderBy } = buildQueryFilters(filter);

    // const orderBy = filter === "ratio" ? { rewardRatio: "desc" as const } : filter === "playtime" ? { totalAccumulatedTime: "asc" as const } : undefined

    console.log(filter, "filtering from marketplace")

    // const filter = searchParams?.filter || "";
    const listedNFTs = await db.listedNFT.findMany({
        where: whereFilters,
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
                    song_cover: true,
                    artist_name: true
                }
            }
        },
        ...(orderBy ? { orderBy } : {})

    });

    // console.log(listedNFTs)
    revalidateTag("bought")
    revalidateTag("nft")


    if (listedNFTs.length === 0) {
        return <p>There's currently no NFT Listed on the MARKETPLACE</p>
    }

    if (!listedNFTs.length) {
        return <p>There's currently no NFT Listed on the MARKETPLACE</p>
    }


    return (
        < Suspense fallback={<MarketSkeleton />}>
            <div className="w-full">
                {/* @ts-ignore */}
                <Tracktable data={listedNFTs} />
            </div>
        </Suspense>

    );
};

export default MarketPlace;
