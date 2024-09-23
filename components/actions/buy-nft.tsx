import { useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"

export const BuyNft = () => {

    const nftAddress = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30"
    const tokenId = 2

    return (
        <div >
            <TransactionButton
                transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                        contract,
                        method: "buyBull",
                        params: [nftAddress, tokenId],

                    });
                    return tx;
                }}
                onTransactionConfirmed={() => console.log("lising")}
                onError={(error) =>
                    console.log(error.message)
                }
            >
                Buy Nft
            </TransactionButton>
        </div >
    );
};
