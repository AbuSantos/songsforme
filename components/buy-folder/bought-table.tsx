"use client"
// import { BuyNFT } from "@/components/buy-folder/buy-nft"
import { Text } from "@radix-ui/themes"
import { BuyNFT, ListedNFT } from "@/types";
import Link from "next/link";
import { Playlisten } from "@/components/startlistening/play-listen";
import { Actions } from "@/components/actions/actions";
import Image from "next/image";

import { RelistNft } from "./relist";
import { CancelListing } from "./cancel-folder/cancel-listing";
import { TogglingSell } from "../musicNFTs/listedNFT/toggle-buy-sell";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleState } from "@/actions/toggle-buy-sell";
import { mutate } from "swr";

type TrackTableType = {
    data: BuyNFT
    userId: string
}


export const BoughtTable = ({ data, userId }: TrackTableType) => {
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
    const [isPending, startTransition] = useTransition();


    // Toggle function to switch buy/sell mode for individual NFTs
    const toggleBuySell = (nftId: string) => {
        const newBuyingState = !isEnabled[nftId];
        startTransition(async () => {
            //@ts-ignore
            const res = await toggleState(nftId, newBuyingState);
            if (res.message) {
                toast.success(res.message);
                mutate(`api/listednft`)
            }
            setIsEnabled((prev) => ({
                ...prev,
                [nftId]: newBuyingState,
            }));
            // Store the updated state in localStorage
            window.localStorage.setItem(`buy_${nftId}`, JSON.stringify(newBuyingState));
        });
    };

    // Restore toggle state from localStorage on mount
    useEffect(() => {
        const storedStates: Record<string, boolean> = {};

        // Iterate over the keys of the `data` object
        Object.entries(data).forEach(([key, track]) => {
            const storageKey = `buy_${key}`;
            const storedState = window.localStorage.getItem(storageKey);

            if (storedState) {
                try {
                    storedStates[key] = JSON.parse(storedState);
                } catch (error) {
                    console.error(`Failed to parse localStorage item for key ${storageKey}:`, error);
                }
            }
        });
        setIsEnabled(storedStates);
    }, [data]);

    try {
        return (
            <div>
                {data &&
                    <div className="flex items-center justify-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A] text-[#EEEEEE] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE]   px-2 py-2 w-full mt-2 text-start rounded-md ">
                        <Link href={`/dashboard/trackinfo/${data.listedNftId}`} className="flex w-8/12 items-center ">
                            <div className="flex flex-col w-8/12">
                                <small className="uppercase text-[0.7rem] ">
                                    {data?.listedNft?.Single?.artist_name || "untitled track"}
                                </small>
                            </div>
                            <div className="flex items-center justify-center  w-4/12">
                                <span>
                                    {data?.listedNft?.price}
                                </span>
                                <Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={15} height={15} className='ml-1' />
                            </div>
                        </Link>
                        <div className="flex items-center space-x-3 ">
                            {
                                data?.status === "NONE" ?
                                    < RelistNft seller={userId} nft={data} /> :
                                    <CancelListing address={data?.listedNft?.contractAddress} tokenId={data?.listedNft?.tokenId} nftId={data?.listedNft?.id} userId={userId} nftBoughtId={data?.id} price={data?.price} />
                            }
                            <TogglingSell toggleBuySell={() => toggleBuySell(data.listedNftId)} isEnabled={isEnabled[data.listedNftId] || false} />
                        </div>
                        <div className="items-center space-x-2 flex ml-2">
                            <Playlisten userId={userId} nftId={data?.listedNftId} nftContractAddress={data?.listedNft?.contractAddress} tokenId={data?.listedNft?.tokenId} />
                        </div>
                    </div>
                }
            </div>
        )
    } catch (error) {
        console.log(error)
    }
}