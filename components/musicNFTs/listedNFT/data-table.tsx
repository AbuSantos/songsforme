"use client"
import { BuyNFT } from "@/components/buy-folder/buy-nft"
import { MakeBid } from "@/components/modal/make-bid"
import { getContractMetadata } from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";

import { Text } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import { client } from "@/lib/client"
import { polygonAmoy, sepolia } from "thirdweb/chains"
import { PlayTrack } from "./get-track"
import { SelectPlaylist } from "@/components/playlists/selectplaylist";
import { ListedNFT } from "@/types";

type TrackTableType = {
    data: ListedNFT[]
    userId?: string
}


export const Tracktable = ({ data, userId }: TrackTableType) => {

    return (
        <div>
            <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-2">
                <Text className="uppercase font-extralight w-10 text-[0.8rem] ">T-ID</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">title</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-2/12 ">price</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">action</Text>
            </header>

            {data.map((track, index: number) => (
                <div key={index} className="flex items-center border-b-[0.5px] border-b-[#2A2A2A] text-[#7B7B7B] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE]   px-2 py-2 w-full mt-2 text-start rounded-md ">
                    <p className="w-10 ">
                        {track?.tokenId}
                    </p>
                    <div className="flex flex-col w-6/12">
                        <p className="text-[1rem] capitalize">

                        </p>
                        <small className="uppercase">
                            FT: Santos
                        </small>
                    </div>
                    <div className="flex flex-col w-2/12">
                        {track?.price}
                    </div>
                    <div className="flex items-center space-x-2">
                        < MakeBid nftAddress={track?.contractAddress} tokenId={track?.tokenId} />
                        <BuyNFT nftAddress={track?.contractAddress} tokenId={track?.tokenId} price={track?.price} listedNftId={track?.id} />
                        <SelectPlaylist nftId={track?.id} userId={userId} />
                    </div>
                    {/* < PlayTrack address={"0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0"} /> */}
                </div>

            ))}
        </div>

    )
}