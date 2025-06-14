"use client"
// import { BuyNFT } from "@/components/buy-folder/buy-nft"
import { Text } from "@radix-ui/themes"
import { BuyNFT, ListedNFT } from "@/types";
import Link from "next/link";
// import { Playlisten } from "@/components/startlistening/play-listenn";
import { Actions } from "@/components/actions/actions";
import Image from "next/image";

import { RelistNft } from "./relist";
import { CancelListing } from "./cancel-folder/cancel-listing";
import { TogglingSell } from "../musicNFTs/listedNFT/toggle-buy-sell";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleState } from "@/actions/toggle-buy-sell";
import { mutate } from "swr";
import { Playlisten } from "../startlistening/play-listen";

import { ethers } from "ethers";
import { startTransition } from "react";
import { contractAddress, nftMintingABI } from "@/lib/client";

type TrackTableType = {
    data: BuyNFT
    userId: string
    email: string
}


export const BoughtTable = ({ data, userId, email }: TrackTableType) => {
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
    const [isPending, startTransition] = useTransition();

    // Toggle function to switch buy/sell mode for individual NFTs
    const toggleBuySell = async (nftId: string, tokenId: string, nftContractAddress: string) => {
        const newBuyingState = !isEnabled[nftId];

        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }

            // Request MetaMask connection first
            await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Now initialize provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Ensure connection
            const signer = await provider.getSigner();

            const userAddress = await signer.getAddress();

            if (newBuyingState === true) {
                try {
                    // Validate contract
                    if (!ethers.utils.isAddress(nftContractAddress)) {
                        throw new Error("Invalid contract address");
                    }

                    const newContract = new ethers.Contract(
                        nftContractAddress,
                        nftMintingABI,
                        signer
                    );

                    // Convert tokenId and verify contract methods
                    const tokenIdBN = ethers.BigNumber.from(tokenId);

                    // Check if contract has ownerOf method
                    if (!newContract.ownerOf) {
                        throw new Error("Invalid NFT contract - missing ownerOf method");
                    }

                    // Try getting token owner with timeout
                    const ownerPromise = newContract.ownerOf(tokenIdBN);
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Owner check timed out")), 10000)
                    );

                    const owner = await Promise.race([ownerPromise, timeoutPromise]);

                    if (!owner || owner.toLowerCase() !== userAddress.toLowerCase()) {
                        toast.error("You don't own this NFT");
                        return;
                    }

                    const tx = await newContract.approve(contractAddress, tokenIdBN);

                    //await for the transaction to be mined
                    const receipt = await tx.wait();

                    if (receipt.status !== 1) {
                        toast.error("Transaction failed");
                        return;
                    }
                    toast.success("NFT approved successfully");
                } catch (error: any) {
                    console.error("Contract error:", error);
                    toast.error(error.message || "Failed to verify ownership");
                    return;
                }
            }

            // Toggle sale state after successful approval
            startTransition(async () => {
                //@ts-ignore
                const res = await toggleState(nftId, newBuyingState);
                if (res.message) {
                    toast.success(res.message);
                    setIsEnabled((prev) => ({
                        ...prev,
                        [nftId]: newBuyingState,
                    }));
                    window.localStorage.setItem(`sell_${nftId}`, JSON.stringify(newBuyingState));
                }
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to toggle sale state");
        }
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
                        <div className="flex w-8/12 items-center ">
                            <div className="flex w-8/12 items-center justify-start">
                                <span className="text-[0.7rem] font-semibold">
                                    {data?.listedNft?.tokenId}
                                </span>

                                <div className=" flex flex-col ml-2 ">
                                    <div>
                                        <span className="text-[0.8rem] font-semibold capitalize">
                                            {data?.listedNft?.Single?.song_name}
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/artistehub/${data.listedNft?.Single?.owner}`} className="uppercase text-[0.6rem] hover:text-[#8E4EC6]">
                                        {data?.listedNft?.Single?.artist_name || "untitled track"}
                                    </Link>
                                </div>
                            </div>
                            <Link href={`/dashboard/trackinfo/${data.listedNft?.contractAddress}`} className="flex items-center justify-center  w-5/12">
                                <span>
                                    {data?.listedNft?.price}
                                </span>
                                <Image src={"/base-logo.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-3 ">
                            {
                                data?.status === "NONE" ?
                                    < RelistNft seller={userId} nft={data} email={email} /> :
                                    <CancelListing address={data?.listedNft?.contractAddress} tokenId={data?.listedNft?.tokenId} nftId={data?.listedNft?.id} userId={userId} nftBoughtId={data?.id} price={data?.price} />
                            }
                            <TogglingSell toggleBuySell={() => toggleBuySell(data.listedNftId, (data?.tokenId || ""), data?.listedNft?.contractAddress)} isEnabled={isEnabled[data.listedNftId] || false} />
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