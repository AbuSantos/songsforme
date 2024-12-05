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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BuyActivity } from "./activity/activity";
import { AllOffer } from "./offers/offers";

const BoughtNFT = () => {
    // Retrieve and format the user ID from session state
    const userId = useRecoilValue(isConnected)?.userId;


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

            <Tabs defaultValue="my_nft" className="h-full border-0 ">
                <div className="m-auto flex items-center justify-center">
                    <TabsList className="space-x-3 w-[4/12] bg-black p-3">
                        <TabsTrigger value="my_nft" className="relative">
                            My NFTs
                        </TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="offer">Offers</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent
                    value="my_nft"
                    className="border-none md:pt-14 pt-2 outline-none px-2 "

                >
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
                </TabsContent>
                <TabsContent
                    value="activity"
                    className="border-none md:pt-14 pt-2 outline-none px-2 "
                >
                    <BuyActivity />
                </TabsContent>
                <TabsContent
                    value="activity"
                    className="border-none md:pt-14 pt-2 outline-none px-2 "
                >
                    <AllOffer userId={userId} />
                </TabsContent>
            </Tabs>



        </div>
    );
};

export default BoughtNFT;
