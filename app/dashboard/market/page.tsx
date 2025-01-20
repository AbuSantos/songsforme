"use server"

import { Search } from "@/components/dashboard/search/search-songs";
import { FilterByTime } from "@/components/marketplace/filter/filter-by-time";
import { MarketSkeleton } from "@/components/marketplace/marketplace-skeleton";
import Tracktable from "@/components/musicNFTs/listedNFT/data-table";
import { FilterPlace } from "@/components/playlists/filter-playlist";
import { db } from "@/lib/db";
import { getAddressOrName, getTimeThreshold } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { Suspense } from "react";

type ParamProp = {
    id: string;
};

const MarketPlace = async ({ searchParams }: { searchParams: { filter?: string, page?: string, query?: string } }) => {

    console.log(searchParams)

    // Function to handle GET request to fetch playlists for a given user
    const ITEM_PER_PAGE = 15;
    const page = Number(searchParams.page) || 1;
    const searchQuery = searchParams.query || undefined;
    const filterQuery = searchParams.filter || undefined


    const buildQueryFilters = (filter: string | undefined) => {
        //   @ts-ignore 
        const threshHold = getTimeThreshold(filter || undefined);
        const song_Name = filter?.trim();
        //   @ts-ignore 
        const { address } = getAddressOrName(filter || undefined);

        const whereFilters = {
            sold: false,
            ...(filter && filter !== "ratio" && song_Name
                ? {
                    Single: {
                        is: {
                            song_name: {
                                contains: song_Name,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                }
                : {}),
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

    // Determine ordering based on query parameters
    const orderBy =
        filterQuery === "ratio"
            ? { rewardRatio: "desc" as const }
            : filterQuery === "playtime"
                ? { accumulatedTime: "asc" as const }
                : undefined;

    try {
        const listedData = await db.listedNFT.findMany({
            where: {
                sold: false,
                ...(searchQuery && {
                    contractAddress: { contains: searchQuery, mode: "insensitive" },
                }),
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
                        song_name: true,
                    },
                },
            },

            ...(orderBy ? { orderBy } : {}),
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (page - 1),
        });

        revalidateTag("bought");
        revalidateTag("nft");

        console.log(listedData)



        return (
            <div>
                <div className="md:flex space-x-2 justify-between bg-[#111111] fixed md:w-[67.2%] w-full m-auto">
                    <div className="w-[98%] flex items-center m-auto ">
                        <Search placeholder="Search songs..." />
                    </div>
                    <div className="flex items-center w-[95%] space-x-2">
                        <FilterPlace />
                        <FilterByTime />
                    </div>
                </div>
                <div className="w-full  md:pt-16 pt-2 px-2">
                    <div className="w-full">
                        {/* @ts-ignore */}
                        <Tracktable data={listedData} />
                    </div>
                </div>

            </div>
        )



    } catch (error: any) {
        console.log(error.message)
    }
}


export default MarketPlace;