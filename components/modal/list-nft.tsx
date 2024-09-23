import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { client, contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { ethers } from "ethers";
type modalTypes = {
    setListModalOpen: Dispatch<SetStateAction<boolean>>
}

export const ListNFTForm = ({ setListModalOpen }: modalTypes) => {
    const [isPending, startTransition] = useTransition();
    const [transaction, setTransaction] = useState()
    const [errorMessage, setErrorMessage] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [tokenId, setTokenId] = useState("");



    const handlelisting = async () => {
        try {
            // Ensure price is a valid number
            if (!price || isNaN(Number(price)) || Number(price) <= 0) {
                setErrorMessage("Please enter a valid price.");
                return null;
            }
            const priceInWei = ethers.utils.parseEther(price); // Convert price to wei

            // Prepare transaction
            const tx = prepareContractCall({
                contract,
                method: "listBull",
                params: [address, tokenId, priceInWei],
                // value: toWei(price), // Convert price to Wei
                value: toWei("0.0005"),
            });

            return tx;
        } catch (error) {
            setErrorMessage("Failed to prepare transaction. Check input values.");
            return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ">
            <div className="relative bg-black rounded-md w-2/6 py-8 px-6 border-[0.7px] border-gray-600">
                {/* Close button */}
                <button
                    onClick={() => setListModalOpen(false)}
                    className="text-red-700 cursor-pointer text-end"
                >
                    <Cross1Icon className="size-4" />
                </button>
                <h1 className="text-center text-2xl text-gray-200 font-medium capitalize p-4">Please add Your Music NFT Details</h1>

                <div className="space-y-3">
                    <Input
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        placeholder="Token ID"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"

                    />

                    <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price in ETH"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"

                    />

                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="NFT Contract Address"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"

                    />

                    <TransactionButton
                        transaction={handlelisting}
                        onTransactionConfirmed={() => console.log("lising")}
                        onError={(error) => console.log(error, "error")}
                    >
                        Confirm Listing
                    </TransactionButton>
                </div>

            </div>
        </div>
    );
};
