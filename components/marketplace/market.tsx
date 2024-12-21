"use server"
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
// import Tracktable from "../musicNFTs/listedNFT/data-table";
import { Skeleton } from "../ui/skeleton";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";
import { Suspense } from "react";
import { getAddressOrName, getTimeThreshold } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Prisma } from "@prisma/client";

// export const revalidate = 60; // Revalidate every 60 seconds as a fallback
type MarketPlaceProps = {
    filter?: string
}
// Helper: Build query filters dynamically
const buildQueryFilters = (filter: string | undefined) => {
    const threshHold = getTimeThreshold(filter || "");
    const song_Name = filter?.trim();
    const { address } = getAddressOrName(filter || "");

    const whereFilters = {
        sold: false,
        ...(filter && filter !== "ratio" && song_Name ? {
            Single: {
                is: {
                    song_name: {
                        contains: song_Name,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
            }
        } : {}),
        ...(threshHold && { listedAt: { gte: threshHold } }),
        ...(address && { contractAddress: address }),
    };

    const orderBy =
        filter === "ratio"
            ? { rewardRatio: "desc" as const }
            : filter === "playtime"
                ? { totalAccumulatedTime: "asc" as const }
                : undefined;

    return { whereFilters, orderBy };
};



const MarketPlace = async ({ filter }: MarketPlaceProps) => {
    const { whereFilters, orderBy } = buildQueryFilters(filter);


    const listedNFTs = await db.listedNFT.findMany({
        where: {
            ...whereFilters,
        },
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
                    artist_name: true,
                    song_name: true
                }
            }
        },
        ...(orderBy ? { orderBy } : {})

    });

    // console.log(listedNFTs)
    revalidateTag("bought")
    revalidateTag("nft")


    if (!listedNFTs.length) {
        return <p className="mt-8"> There&apos;s currently no NFT Listed on the MARKETPLACE</p>;
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
