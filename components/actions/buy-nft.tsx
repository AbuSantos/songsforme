import { useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { toWei } from "thirdweb";

export const BuyNft = () => {

    const nftAddress = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30"
    const tokenId = 2

    return (
        <div className="max-w-[20px]">
            <TransactionButton
                className=" w-[25px] bg-black"
                transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                        contract,
                        method: "buyBull",
                        params: [nftAddress, tokenId],
                        value: toWei("0.01"),
                    });
                    return tx;
                }}
                onTransactionConfirmed={() => console.log("lising")}
                onError={(error) =>
                    toast("NFT ERROR", {
                        description: error.name
                    })
                    // console.log(error.message)
                }
            >
                Buy NFT
            </TransactionButton>
        </div >
    );
};
