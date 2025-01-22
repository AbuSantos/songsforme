"use client"
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { toast } from "sonner"
import { prepareTransaction, toWei } from "thirdweb";
import useSWR, { mutate } from 'swr';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { ethers } from "ethers";
import { listedNFT } from "@/actions/listNFT";
import Image from "next/image";
import { relistSong } from "@/actions/relist-song";
type listingProps = {
    nft: any
    seller: string
    email: string

}

export const RelistNft = ({ nft, seller, email }: listingProps) => {
    const [isPending, startTransition] = useTransition();
    const [price, setPrice] = useState<string>("");
    const [isError, setIsError] = useState("");
    const [isSuccess, setIsSuccess] = useState("");
    const [errorMessage, setErrorMessage] = useState("");



    const apiUrl = seller ? `/api/buynft/${seller}` : null;

    const saveListing = async (
        price: string,
    ) => {
        startTransition(async () => {
            try {

                const response = await relistSong(seller, nft?.listedNft?.tokenId, price, nft?.listedNft?.contractAddress, nft?.id, email);
                if (response?.message) {
                    mutate(apiUrl)
                    setIsSuccess(response.message);
                    toast.success("NFT listed successfully!");
                } else {
                    setErrorMessage("Failed to list NFT.");
                }
            } catch (error) {
                setErrorMessage("Failed to save transaction. Network error.");
            }
        });
    };


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-slate-100 text-black ">
                    relist
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col space-y-3">
                    <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} // Handling input
                        placeholder="Price of the NFT..."
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />

                    {/* <TransactionButton
                        transaction={() => {
                            const priceInWei = ethers.utils.parseEther(price);
                            const tx = prepareContractCall({
                                contract,
                                //@ts-ignore
                                method: "function listBull(address _nftAddress, uint256 _tokenId, uint256 _price) payable",
                                params: [nft?.listedNft?.contractAddress, nft?.listedNft?.tokenId, priceInWei],
                                // value: toWei(price), 
                                value: toWei("0.0005"),
                            });

                            return tx;
                        }}
                        onTransactionConfirmed={(tx) => {
                            console.log(tx, "transaction")
                            try {
                                if (tx.status === "success") {
                                    saveListing(
                                        price,
                                    )
                                }
                            } catch (error) {
                                console.log(error, "error saving")
                            }
                        }}
                        onError={(error) =>

                            console.log(error)

                        }
                    >
                        Confirm Listing
                    </TransactionButton> */}
                    <Button
                        onClick={() => saveListing(price)}
                    >
                        save listing
                    </Button>
                </div>
            </PopoverContent>

        </Popover >

    );
};
