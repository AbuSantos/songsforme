"use client";

import { Suspense } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/utils";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";

const MarketPlace = () => {
    const searchParams = useSearchParams();
    const filter = searchParams?.get("filter");
    const apiUrl = `/api/listednft?filter=${filter || ""}`;
    try {
        const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        });

        if (error) {
            return <p className="mt-8">Failed to load marketplace data. Please try again later.</p>;
        }

        if (isLoading) {
            return <p className="mt-8">loading...</p>;
        }

        return (
            <Suspense fallback={<MarketSkeleton />}>
                <div className="w-full">
                    <Tracktable data={data} />
                </div>
            </Suspense>
        );
    } catch (error: any) {
        console.log(error.message)
    }


};

export default MarketPlace;
