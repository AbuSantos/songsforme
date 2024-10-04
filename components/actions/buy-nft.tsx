import { useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { toWei } from "thirdweb";

export const BuyNFT = () => {

    const nftAddress = "0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0"
    const tokenId = 0

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
