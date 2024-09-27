import { useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { toWei } from "thirdweb";

export const BuyNFT = () => {

    const nftAddress = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30"
    const tokenId = 2

    return (
        <div >
            <TransactionButton
                className=" w-[60px] p-2 bg-black"
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
