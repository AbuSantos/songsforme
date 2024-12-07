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
import { Text } from "@radix-ui/themes";

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

    console.log(nfts, "NFT from bought table")
    console.log(userId, "user id from data")

    if (!userId) {
        return (
            <p className="text-center p-2">
                Please connect your wallet to view your NFTs.
            </p>
        );
    }
    try {
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

                            <div className="w-full">
                                <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-2">
                                    <Text className="uppercase font-extralight w-10 text-[0.8rem] ">T-ID</Text>
                                    <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">title</Text>
                                    <Text className="font-[50] capitalize text-[0.8rem] w-2/12 ">price</Text>
                                    <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">action</Text>
                                </header>
                                {
                                    nfts?.map((nft: BuyNFT) => (
                                        <div className="w-full" key={nft.id}>
                                            <BoughtTable data={nft} userId={userId} />
                                        </div>
                                    ))}
                            </div>
                        </div>

                    </TabsContent>
                    <TabsContent
                        value="activity"
                        className="border-none md:pt-14 pt-2 outline-none px-2 "
                    >
                        <BuyActivity />
                    </TabsContent>
                    <TabsContent
                        value="offer"
                        className="border-none md:pt-14 pt-2 outline-none px-2 "
                    >
                        <AllOffer userId={userId} />
                    </TabsContent>
                </Tabs>



            </div>
        );
    } catch (error: any) {
        console.log(error.message)
    }


};

export default BoughtNFT;
