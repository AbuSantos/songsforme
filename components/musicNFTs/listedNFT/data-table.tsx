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
import { SelectPlaylist } from "@/components/playlists/selectplaylist";
import { Favorite } from "../favorite/fav";
import { MakeBid } from "@/components/bids/make-bid";
import { Copy } from "@/components/actions/copy";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { getNFTMetadata } from "@/actions/helper/get-metadata";
import { useRouter } from "next/navigation";
import { SCopy } from "@/components/actions/s-copy";
import { contractAddress, nftContract, nftMintingABI } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { ethers } from "ethers";

type TrackTableType = {
    data: ListedNFT[];
};

// 572,000,000,000
export const Tracktable: React.FC<TrackTableType> = ({ data }) => {
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
    const userId = useRecoilValue(isConnected)?.userId;
    const usrname = useRecoilValue(isConnected)?.username
    const userEmail = useRecoilValue(isConnected)?.userEmail;
    const [isPending, startTransition] = useTransition();

    // Toggle function to switch buy/sell mode for individual NFTs
    const toggleBuySell = async (nftId: string, tokenId: string, nftContractAddress: string) => {
        const newBuyingState = !isEnabled[nftId];

        try {
            // Check specifically for MetaMask
            const isMetaMask = window.ethereum?.isMetaMask;

            if (!isMetaMask) {
                toast.error("Please install MetaMask");
                return;
            }

            // Request MetaMask specifically
            await window.ethereum.request({
                method: 'eth_requestAccounts'
            }).catch((err: any) => {
                if (err.code === 4001) {
                    throw new Error('Please connect to MetaMask');
                }
                throw err;
            });

            // Force MetaMask as the provider
            const provider = new ethers.providers.Web3Provider(window.ethereum, {
                name: 'Sepolia',
                chainId: 11155111
            });

            // Request network switch with proper parameters
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId: '0xaa36a7'  // 11155111 in hex
                    }]
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia',
                            nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                            rpcUrls: ['https://sepolia.infura.io/v3/']
                        }]
                    });
                }
                throw switchError;
            }

            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            console.log('Token ID:', tokenId);
            console.log('User Address:', userAddress);

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

                    console.log('Owner:', owner);

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
        const storedStates = data?.reduce((acc: Record<string, boolean>, track) => {
            const storedState = window.localStorage?.getItem(`sell_${track.id}`);
            if (storedState) {
                acc[track.id] = JSON.parse(storedState);
            }
            return acc;
        }, {});
        setIsEnabled(storedStates);
    }, [data]);

    try {
        return (
            <div className="scroll-smooth">
                <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-1">
                    <Text className="uppercase font-extralight w-10 text-[0.8rem] ">T-ID</Text>
                    <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">Title</Text>
                    <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">Price</Text>
                    <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">Action</Text>
                </header>

                {data?.map((track) => {
                    return (
                        <div
                            key={track.id}
                            className="flex items-center justify-between border-b-[0.5px] border-b-[#2A2A2A] text-[#7B7B7B] bg-[var(--data-table-bg)] hover:bg-[var(--data-table-hover-bg)] hover:text-[var(--data-table-text)] px-1 py-2 w-full mt-2 text-start rounded-md z-10 scroll-smooth"
                        >
                            <Link href={`/dashboard/trackinfo/${track.contractAddress}?tokenId=${track.tokenId}`} className="flex w-6/12 items-center">
                                <p className="w-10 hidden md:block">{track?.tokenId}</p>
                                <div className="flex flex-col w-8/12">
                                    <p className="flex space-x-2 items-center">
                                        <span className="text-[0.8rem] md:text-[1rem] capitalize">
                                            {track?.Single?.song_name || track?.Single?.artist_name || "Untitled Track"}
                                        </span>
                                        <Copy address={track?.contractAddress} mode="data" />
                                    </p>
                                </div>
                                <div className="flex items-center justify-center w-4/12">
                                    <span>{track?.price}</span>
                                    <Image src={"/base-logo.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                                </div>
                            </Link>

                            <div className="z-0">
                                {userId && (track?.sold === true ?
                                    (<Badge className="bg-[teal] text-[0.7rem]">Sold</Badge>) : track?.seller === userId ?
                                        (
                                            <TogglingSell toggleBuySell={() => toggleBuySell(track.id, track?.tokenId, track?.contractAddress)} isEnabled={isEnabled[track.id] || false} />
                                        ) : track?.isSaleEnabled ? (
                                            <BuyNFT
                                                buyer={userId || ""}
                                                nftAddress={track.contractAddress}
                                                tokenId={track.tokenId}
                                                price={track.price}
                                                listedNftId={track.id}
                                                usrname={usrname || ""}
                                                email={userEmail || ""}
                                            />
                                        ) : (
                                            < MakeBid tokenId={track?.tokenId} nftAddress={track?.contractAddress} nftId={track?.id} userId={userId} />
                                        ))}
                            </div>
                            <div className="items-center space-x-2 flex ml-2">
                                {/* <Playlisten userId={userId} nftId={track.id} nftContractAddress={track?.contractAddress} tokenId={track?.tokenId} /> */}
                                <div className="block md:hidden">

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="bg-transparent p-0 hover:bg-transparent border-none" size="nav">
                                                <svg width="20" height="20" viewBox="0 0 15 15" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] space-y-2">
                                            <SelectPlaylist userId={userId} nftId={track.id} />
                                            <Favorite nftId={track?.id} userId={userId} />
                                            <SCopy address={track?.contractAddress} mode="data" />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="items-start hidden md:flex space-x-2 ">
                                    <SelectPlaylist userId={userId} nftId={track.id} />
                                    <Favorite nftId={track?.id} userId={userId} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        );

    } catch (error: any) {
        console.log(error.message)
    }
};

export default Tracktable;


