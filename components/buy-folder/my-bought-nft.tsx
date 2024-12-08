"use client";
import React from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import SingleNft from "./bought-single";
import { RelistNft } from "./relist";
import { isConnected } from "@/atoms/session-atom";
import { fetcher } from "@/lib/utils";
import { BoughtTable } from "./bought-table";
import { MarketSkeleton } from "../marketplace/marketplace-skeleton";
import { BuyNFT } from "@/types";

const BoughtNFT = () => {
    // Retrieve and format the user ID from session state
    const userId = useRecoilValue(isConnected)?.toLowerCase();
    console.log("userId:from bought:", userId);

    // Conditionally set the API URL only if userId is available
    const apiUrl = userId ? `/api/buynft/${userId}` : null;

    // Use SWR to fetch data; only fetch if `apiUrl` is not null
    const { data: nfts, error, isLoading } = useSWR<BuyNFT[]>(
        apiUrl,
        apiUrl ? fetcher : null, 
        {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    );

    if (!userId) {
        return (
            <p className="text-center p-2">
                Please connect your wallet to view your NFTs.
            </p>
        );
    }

    return (
        <div>
            <h2 className="text-center p-2">My NFTs</h2>
            <div className="flex flex-wrap space-x-4 pb-4 w-full">
                {isLoading && <MarketSkeleton />}
                {!isLoading && error && (
                    <p className="text-center text-red-500">
                        Failed to load NFTs. Please try again later.
                    </p>
                )}
                {!isLoading && nfts?.length === 0 && (
                    <p className="text-center">You have no NFTs.</p>
                )}
                {!isLoading &&
                    nfts?.map((nft: BuyNFT) => (
                        <div className="w-full" key={nft.id}>
                            <BoughtTable data={nft} userId={userId} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BoughtNFT;
