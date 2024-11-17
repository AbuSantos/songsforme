"use client"
import React, { useEffect, useState, useTransition } from "react";
import { BuyNFT } from "@/components/buy-folder/buy-nft";
import { Text } from "@radix-ui/themes";
import { ListedNFT } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { TogglingSell } from "./toggle-buy-sell";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { toggleState } from "@/actions/toggle-buy-sell";
import { toast } from "sonner";
import { Playlisten } from "@/components/startlistening/play-listen";

type TrackTableType = {
    data: ListedNFT[];
};

//FIX THE USERID CASING PROBLEM

export const Tracktable: React.FC<TrackTableType> = ({ data }) => {
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
    const userId = useRecoilValue(isConnected).toLowerCase();
    // const userId = useRecoilValue(isConnected).toLowerCase();
    const [isPending, startTransition] = useTransition();

    console.log(userId, "user id form the tracklist")
    console.log(data)
    // Toggle function to switch buy/sell mode for individual NFTs
    const toggleBuySell = (nftId: string) => {
        const newBuyingState = !isEnabled[nftId];
        startTransition(async () => {
            //@ts-ignore
            const res = await toggleState(nftId, newBuyingState);
            if (res.message) {
                toast.success(res.message);
            }
            setIsEnabled((prev) => ({
                ...prev,
                [nftId]: newBuyingState,
            }));
            // Store the updated state in localStorage
            window.localStorage.setItem(`sell_${nftId}`, JSON.stringify(newBuyingState));
        });
    };

    // Restore toggle state from localStorage on mount
    useEffect(() => {
        const storedStates = data.reduce((acc: Record<string, boolean>, track) => {
            const storedState = window.localStorage.getItem(`sell_${track.id}`);
            if (storedState) {
                acc[track.id] = JSON.parse(storedState);
            }
            return acc;
        }, {});
        setIsEnabled(storedStates);
    }, [data]);

    return (
        <div>
            <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-2">
                <Text className="uppercase font-extralight w-10 text-[0.8rem] ">T-ID</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">Title</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-2/12 ">Price</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">Action</Text>
            </header>

            {data.map((track) => (
                <div
                    key={track.id}
                    className="flex items-center justify-between border-b-[0.5px] border-b-[#2A2A2A] text-[#7B7B7B] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE] px-2 py-2 w-full mt-2 text-start rounded-md"
                >
                    <Link href={`/dashboard/trackinfo/${track.id}`} className="flex w-8/12 items-center">
                        <p className="w-10">{track?.tokenId}</p>
                        <div className="flex flex-col w-8/12">
                            <p className="text-[0.8rem] md:text-[1rem] capitalize">{track?.Single?.artist_name || "Untitled Track"}</p>
                        </div>
                        <div className="flex items-center justify-center w-4/12">
                            <span>{track?.price}</span>
                            <Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                        </div>
                    </Link>

                    <div>
                        {userId && (track?.seller === userId ? (
                            <TogglingSell toggleBuySell={() => toggleBuySell(track.id)} isEnabled={isEnabled[track.id] || false} />
                        ) : track?.isSaleEnabled ? (
                            <BuyNFT
                                buyer={userId || ""}
                                nftAddress={track.contractAddress}
                                tokenId={track.tokenId}
                                price={track.price}
                                listedNftId={track.id}
                            />
                        ) : (
                            <p>Bid</p>
                        ))}
                    </div>
                    <div className="items-center space-x-2 flex ml-2">
                        <Playlisten userId={userId} nftId={track.id} nftContractAddress={track?.contractAddress} tokenId={track?.tokenId} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Tracktable;


