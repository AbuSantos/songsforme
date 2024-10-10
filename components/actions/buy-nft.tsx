import { useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { toWei } from "thirdweb";

interface NFTProps {
    nftAddress: string
    tokenId: number
    price: GLfloat
}
export const BuyNFT = ({ nftAddress, tokenId, price }: NFTProps) => {
    return (
        <div >
            <TransactionButton
                className=" w-[60px] p-2 bg-black"
                transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                        contract,
                        method: "function buyBull(address _nftContract, uint256 _tokenId) payable",
                        params: [nftAddress, tokenId],
                        value: toWei(price as unknown as string),
                    });
                    return tx;
                }}
                onTransactionConfirmed={(tx) => console.log("listing", tx)}
                onError={(error) =>
                    toast("NFT ERROR", {
                        description: error.name
                    })
                    // console.log(error.message)
                }
            >
                Buy
            </TransactionButton>
        </div >
    );
};
