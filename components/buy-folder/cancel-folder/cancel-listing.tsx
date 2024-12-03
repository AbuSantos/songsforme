import { Cross1Icon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { Button } from "../../ui/button";
import { FormField } from "../../ui/form";
import { toast } from "sonner"
import { FormError } from "../../errorsandsuccess/form-error";
import { FormSuccess } from "../../errorsandsuccess/form-success";


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cancelListing } from "@/actions/cancel-listing";
import { mutate } from "swr";

type CancelProps = {
    address: string
    nftId: string
    tokenId: string
    userId: string
    nftBoughtId: string
    price: number
}

export const CancelListing = ({ address, tokenId, nftId, userId, nftBoughtId, price }: CancelProps) => {
    const [isPending, startTransition] = useTransition();
    const apiUrl = userId ? `/api/buynft/${userId}` : null;


    const handleCancel = () => {
        startTransition(async () => {
            try {
                const res = await cancelListing(nftId, userId, nftBoughtId, price)
                if (res.message) {
                    toast.success(res.message)
                    mutate(apiUrl)
                }
            } catch (error: any) {
                toast.error("Something went wrong", error.message)
            }
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-[#E54D2E] hover:bg-[#FF977D] hover:text-[#181111] text-gray-100 ">
                    Cancel listing
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 flex flex-col items-center justify-center">

                <p className="p-3 text-[#E54D2E] text-center">You're about to cancel This song from listing?</p>

                <TransactionButton
                    transaction={() => {
                        // Create a transaction object and return it
                        const tx = prepareContractCall({
                            contract,
                            //@ts-ignore
                            method:
                                "function cancelListing(uint256 _tokenId, address _nftAddress)",
                            params: [tokenId, address],
                        });
                        return tx;
                    }}
                    onTransactionConfirmed={(tx) => {
                        if (tx.status === "success") {
                            handleCancel()
                        }
                        console.log("Transaction confirmed", tx.transactionHash);
                    }}

                    onError={(error) => {
                        toast.error(error.message)
                        console.error("Transaction error", error);
                    }}
                >
                    Confirm Cancel Listing
                </TransactionButton>

                {/* <button onClick={handleCancel} className="bg-gray-300">
                    confirm cancel
                </button> */}
            </PopoverContent>
        </Popover>
    );
};
