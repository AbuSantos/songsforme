import { Cross1Icon } from "@radix-ui/react-icons";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { contract } from "@/lib/client";
import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { Button } from "../ui/button";
import { FormError } from "../errorsandsuccess/form-error";
import { FormSuccess } from "../errorsandsuccess/form-success";

export const MakeBid = () => {
    const [isPending, startTransition] = useTransition();
    const [price, setPrice] = useState<string>("");  // Fixing the state type to store string value
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<string>("");

    const address = "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30";
    const tokenId = 2;

    const handleBid = () => {
        try {
            // Ensure price is a valid number
            if (!price || isNaN(Number(price)) || Number(price) <= 0) {
                setErrorMessage("Please enter a valid price.");
                return null;
            }

            // Prepare transaction
            const tx = prepareContractCall({
                contract,
                method: "bid",
                params: [tokenId, address],
                value: toWei(price), // Convert price to Wei
            });

            return tx;
        } catch (error) {
            setErrorMessage("Failed to prepare transaction. Check input values.");
            return null;
        }
    };

    return (
        <div className="flex flex-col space-y-3">
            <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)} // Handling input
                placeholder="Price in ETH"
                disabled={isPending}
                className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
            />


            <TransactionButton
                transaction={handleBid} 
                onTransactionConfirmed={() => {
                    console.log("Transaction successful");
                    setIsSuccess("Bid Made Successfully")
                }}
                onError={(error) => setErrorMessage(error.message)}  
            >
                Make Bid
            </TransactionButton>
            < FormError message={errorMessage} />
            <FormSuccess message={isSuccess} />
        </div>
    );
};
