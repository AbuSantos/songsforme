import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { client, contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { ethers } from "ethers";
import { FormError } from "../errorsandsuccess/form-error";
import { FormSuccess } from "../errorsandsuccess/form-success";


export const DesktopNFTForm = () => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30");
  const [tokenId, setTokenId] = useState(2);
  const [isSuccess, setIsSuccess] = useState<string>("");


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
    <div className="relative bg-black rounded-md w-full py-8 px-6 border-[0.7px] border-gray-600">

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
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => setErrorMessage(error.message)}
        >
          Confirm Listing
        </TransactionButton>
      </div>

      < FormError message={errorMessage} />
      <FormSuccess message={isSuccess} />
    </div>
  );
};
