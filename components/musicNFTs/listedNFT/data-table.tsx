"use client";

import React, { useEffect, useState } from "react";
import { BuyNFT } from "@/components/buy-folder/buy-nft";
import { Text } from "@radix-ui/themes";
import { ListedNFT } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { TogglingSell } from "./toggle-buy-sell";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";

type TrackTableType = {
    data: ListedNFT[];
};

export const Tracktable: React.FC<TrackTableType> = ({ data }) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const userId = useRecoilValue(isConnected);

    // Toggle between buy and sell mode
    const toggleBuySell = () => {
        const newEnableState = !isEnabled;
        setIsEnabled(newEnableState);
        window.localStorage.setItem("sell", JSON.stringify(newEnableState));
    };

    // Restore toggle state from localStorage on mount
    useEffect(() => {
        const storedState = window.localStorage.getItem("sell");
        if (storedState) {
            setIsEnabled(JSON.parse(storedState));
        }

        // Listen for localStorage changes to sync `isEnabled` across tabs
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "sell" && event.newValue !== null) {
                setIsEnabled(JSON.parse(event.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div>
            <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-2">
                <Text className="uppercase font-extralight w-10 text-[0.8rem] ">T-ID</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">Title</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-2/12 ">Price</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">Action</Text>
            </header>

            {data.map((track, index) => (
                <div
                    key={track.id}
                    className="flex items-center justify-between border-b-[0.5px] border-b-[#2A2A2A] text-[#7B7B7B] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE] px-2 py-2 w-full mt-2 text-start rounded-md"
                >
                    <Link href={`/dashboard/trackinfo/${track.id}`} className="flex w-8/12 items-center">
                        <p className="w-10">{track?.tokenId}</p>
                        <div className="flex flex-col w-8/12">
                            <p className="text-[0.8rem] md:text-[1rem] capitalize">{track?.title || "Untitled Track"}</p>
                            <small className="uppercase text-[0.7rem] ">FT: Santos</small>
                        </div>
                        <div className="flex items-center justify-center w-4/12">
                            <span>{track?.price}</span>
                            <Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                        </div>
                    </Link>

                    <div>
                        {track?.seller === userId ? (
                            <TogglingSell toggleBuySell={toggleBuySell} isEnabled={isEnabled} />
                        ) : isEnabled ? (
                            <BuyNFT
                                buyer={userId || ""}
                                nftAddress={track?.contractAddress}
                                tokenId={track?.tokenId}
                                price={track?.price}
                                listedNftId={track?.id}
                            />
                        ) : (
                            <p>Bid</p>
                        )}
                    </div>

                    {/* Placeholder for future Playlisten component integration */}
                    <div className="items-center space-x-2 flex ml-2">
                        {/* <Playlisten userId={userId} nftId={track.id} nftContractAddress={track?.contractAddress} tokenId={track?.tokenId} /> */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Tracktable;
