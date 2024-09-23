import { Cross1Icon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { toast } from "sonner"
import { FormError } from "../errorsandsuccess/form-error";
import { FormSuccess } from "../errorsandsuccess/form-success";

type modalTypes = {
    setBidModal: Dispatch<SetStateAction<boolean>>
}

export const CancelListing = ({ setBidModal }: modalTypes) => {

    const address = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30"
    const tokenId = 2



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative bg-gray-900 rounded-md w-3/6 py-4 px-6">

                <TransactionButton
                    transaction={() => {
                        // Create a transaction object and return it
                        const tx = prepareContractCall({
                            contract,
                            method: "cancelListing",
                            params: [tokenId, address],
                        });
                        return tx;
                    }}
                    onTransactionConfirmed={(receipt) => {
                        console.log("Transaction confirmed", receipt.transactionHash);
                    }}

                    onError={(error) => {
                        console.error("Transaction error", error);
                    }}
                >
                    Confirm Cancel Listing
                </TransactionButton>
            </div>
        </div >
    );
};
