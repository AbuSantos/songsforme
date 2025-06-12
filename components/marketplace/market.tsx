"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MarketSkeleton } from "./marketplace-skeleton";
import { Tracktable } from "../musicNFTs/listedNFT/data-table";
import InfiniteScroll from 'react-infinite-scroller';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from "@/lib/utils";
import { mutate } from "swr";

interface NFTData {
    id: string;
    tokenId: string;
    price: string;
    contractAddress: string;
    Single: {
        song_name: string;
        artist_name: string;
        song_cover: string;
        genre: string;
    };
}

const MarketPlace = () => {
    const searchParams = useSearchParams();
    const query = searchParams?.get("query");
    const filter = searchParams?.get("filter");
    const [aggregatedData, setAggregatedData] = useState<NFTData[]>([]);

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.data.length) return null;

        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (filter) params.append("filter", filter);
        params.append("page", (pageIndex + 1).toString());

        return `/api/listednft?${params.toString()}`;
    };

    const { data, error, size, setSize, isLoading } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
            persistSize: true,
            revalidateOnFocus: true,
            refreshInterval: 0,
        }
    );

    useEffect(() => {
        if (data) {
            const newData = data.flatMap(page => page.data);
            setAggregatedData(newData);
        }
    }, [data]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                mutate(undefined);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [mutate]);

    const hasNextPage = data?.[data?.length - 1]?.metadata?.hasNextPage;

    if (error) {
        return <p className="mt-4">Failed to load marketplace data. Please try again later.</p>;
    }

    if (isLoading && size === 1) {
        return <MarketSkeleton />;
    }

    return (
        <Suspense fallback={<MarketSkeleton />}>
            <div className="w-full mt-10">
                {/* <InfiniteScroll
                    pageStart={0}
                    loadMore={() => setSize(size + 1)}
                    hasMore={!!hasNextPage}
                    loader={<div key={0} className="flex justify-center py-4">
                        <MarketSkeleton />
                    </div>}
                > */}
                    {/* @ts-ignore */}
                    <Tracktable data={aggregatedData} />
                {/* </InfiniteScroll> */}
            </div>
        </Suspense>
    );
};

export default MarketPlace;