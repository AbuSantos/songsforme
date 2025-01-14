"use client";

import { Suspense, useMemo } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/utils";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";

const MarketPlace = () => {
    const searchParams = useSearchParams();
    const query = searchParams?.get("query");
    const filter = searchParams?.get("filter");

    const apiUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (filter) params.append("filter", filter);

        return `/api/listednft${params.toString() ? `?${params.toString()}` : ''}`;
    }, [query, filter]);

    const { data, error, isLoading } = useSWR(
        apiUrl,
        fetcher,
        {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    );

    try {


        if (error) {
            return <p className="mt-4">Failed to load marketplace data. Please try again later.</p>;
        }

        if (isLoading) {
            return <p className="mt-4">loading...</p>;
        }

        if (!data?.data || data.data.length === 0) {
            return <p className="mt-4">Songs not available, we re currently working to increase our songs count </p>
        }

        return (
            <Suspense fallback={<MarketSkeleton />}>
                <div className="w-full">
                    <Tracktable data={data.data} />
                </div>
            </Suspense>
        );
    } catch (error: any) {
        console.error("Market error:", error);
        return <p className="mt-4">An error occurred.</p>;
    }
};

export default MarketPlace;