"use client";
import { Text } from "@radix-ui/themes";
import { BuyNFT } from "@/types";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { RelistNft } from "./relist";
import { CancelListing } from "./cancel-folder/cancel-listing";
import { TogglingSell } from "../musicNFTs/listedNFT/toggle-buy-sell";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { toggleState } from "@/actions/toggle-buy-sell";
import { ethers } from "ethers";
import { contractAddress, nftMintingABI } from "@/lib/client";

const Playlisten = dynamic(
    () => import("../startlistening/play-listen").then((mod) => mod.Playlisten),
    { ssr: false, loading: () => <div className="w-6 h-6" /> }
);

interface ToggleState {
    [key: string]: boolean;
}

interface TrackTableType {
    data: BuyNFT;
    userId: string;
    email: string;
}

export const BoughtTable = ({ data, userId, email }: TrackTableType) => {
    const [isEnabled, setIsEnabled] = useState<ToggleState>({});

    // Restore toggle state from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedStates = Object.entries(data).reduce((acc, [key]) => {
            try {
                const stored = window.localStorage.getItem(`buy_${key}`);
                if (stored) acc[key] = JSON.parse(stored);
            } catch (error) {
                console.error(`Error parsing localStorage for key ${key}:`, error);
            }
            return acc;
        }, {} as ToggleState);

        setIsEnabled(storedStates);
    }, [data]);

    const toggleBuySell = useCallback(async (nftId: string, tokenId: string, nftContractAddress: string) => {
        const newBuyingState = !isEnabled[nftId];

        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            if (newBuyingState) {
                if (!ethers.utils.isAddress(nftContractAddress)) {
                    throw new Error("Invalid contract address");
                }

                const newContract = new ethers.Contract(
                    nftContractAddress,
                    nftMintingABI,
                    signer
                );

                const tokenIdBN = ethers.BigNumber.from(tokenId);
                const owner = await newContract.ownerOf(tokenIdBN);

                if (owner.toLowerCase() !== userAddress.toLowerCase()) {
                    toast.error("You don't own this NFT");
                    return;
                }

                const tx = await newContract.approve(contractAddress, tokenIdBN);
                const receipt = await tx.wait();

                if (receipt.status !== 1) {
                    toast.error("Transaction failed");
                    return;
                }
                toast.success("NFT approved successfully");
            }
            //@ts-ignore
            const res = await toggleState(nftId, newBuyingState);
            if (res.message) {
                toast.success(res.message);
                setIsEnabled((prev) => ({ ...prev, [nftId]: newBuyingState }));
                window.localStorage.setItem(`sell_${nftId}`, JSON.stringify(newBuyingState));
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to toggle sale state");
        }
    }, [isEnabled]);

    try {
        if (!data) return null;

        return (
            <div className="flex items-center justify-between border-b-[0.5px] border-b-[#2A2A2A] text-[#EEEEEE] bg-[#FFFFFF22] hover:bg-[#484848] px-2 py-2 w-full mt-2 rounded-md">
                <div className="flex w-8/12 items-center">
                    <div className="flex w-8/12 items-center justify-start">
                        <span className="text-[0.7rem] font-semibold">
                            {data.listedNft?.tokenId}
                        </span>
                        <div className="flex flex-col ml-2">
                            <span className="text-[0.8rem] font-semibold capitalize">
                                {data.listedNft?.Single?.song_name}
                            </span>
                            <Link
                                href={`/dashboard/artistehub/${data.listedNft?.Single?.owner}`}
                                className="uppercase text-[0.6rem] hover:text-[#8E4EC6]"
                            >
                                {data.listedNft?.Single?.artist_name || "untitled track"}
                            </Link>
                        </div>
                    </div>
                    <Link
                        href={`/dashboard/trackinfo/${data.listedNft?.contractAddress}`}
                        className="flex items-center justify-center w-5/12"
                    >
                        <span>{data.listedNft?.price}</span>
                        <Image
                            src="/base-logo.svg"
                            alt="base eth"
                            width={15}
                            height={15}
                            className="ml-1"
                        />
                    </Link>
                </div>
                <div className="flex items-center space-x-3">
                    {data.status === "NONE" ? (
                        <RelistNft seller={userId} nft={data} email={email} />
                    ) : (
                        <CancelListing
                            address={data.listedNft?.contractAddress}
                            tokenId={data.listedNft?.tokenId}
                            nftId={data.listedNft?.id}
                            userId={userId}
                            nftBoughtId={data.id}
                            price={data.price}
                        />
                    )}
                    <TogglingSell
                        toggleBuySell={() =>
                            toggleBuySell(
                                data.listedNftId,
                                data.tokenId || "",
                                data.listedNft?.contractAddress
                            )
                        }
                        isEnabled={isEnabled[data.listedNftId] || false}
                    />
                </div>
                <div className="flex items-center space-x-2 ml-2">
                    <Playlisten
                        userId={userId}
                        nftId={data.listedNftId}
                        nftContractAddress={data.listedNft?.contractAddress}
                        tokenId={data.listedNft?.tokenId}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("BoughtTable render error:", error);
        return (
            <div className="text-red-500 p-4">
                Failed to load track information
            </div>
        );
    }
};