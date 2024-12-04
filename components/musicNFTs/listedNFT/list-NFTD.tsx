"use client"
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { client, contract } from "@/lib/client";
import { prepareContractCall, toEther } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { ethers } from "ethers";
import { FormError } from "../../errorsandsuccess/form-error";
import { FormSuccess } from "../../errorsandsuccess/form-success";
import { listedNFT } from "@/actions/listNFT";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
interface singleIdProps {
  singleId?: string
}
export const DesktopNFTForm = ({ singleId }: singleIdProps) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState<string>("");
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<string>("");
  const seller = useRecoilValue(isConnected)?.userId;

  console.log(seller, "from listed")

  // 0xCeC2f962377c87dee0CA277c6FcC762254a8Dcd9

  const saveListing = (seller: string, tokenId: number, price: string, nftAddress: string, singleId?: string) => {
    startTransition(async () => {
      try {
        const response = await listedNFT(seller, tokenId.toString(), price, nftAddress, singleId)
        if (response.message) {
          toast.success("NFT listed successfully!");
        }
      } catch (error: any) {
        setErrorMessage("Failed to save transaction. Network.");
        toast.error("Something went wrong", error.message)
      }
    });
  };

  return (
    <div className="relative bg-black rounded-md w-full py-8 px-6 border-[0.7px] border-gray-600">
      <h1 className="text-center text-2xl text-gray-200 font-medium capitalize p-4">Please add Your Music NFT Details</h1>

      <div className="space-y-3">
        <Input
          value={tokenId}
          onChange={(e) => setTokenId(Number(e.target.value))}
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
          transaction={() => {
            const priceInWei = ethers.utils.parseEther(price);
            const tx = prepareContractCall({
              contract,
              //@ts-ignore
              method: "function listBull(address _nftAddress, uint256 _tokenId, uint256 _price) payable",
              params: [address, tokenId, priceInWei],
              // value: toWei(price), 
              value: toWei("0.0005"),
            });

            return tx;
          }}
          onTransactionConfirmed={(tx) => {
            console.log(tx, "transaction")
            try {
              if (tx.status === "success") {
                saveListing(
                  tx.from,
                  tokenId,
                  price,
                  address,
                  singleId
                )
              }
            } catch (error) {
              console.log(error, "error saving")
            }
          }}
          onError={(error: any) =>
            // toast.error("Something went wrong", error.message)
            console.log(error)
          }
        >
          Confirm Listing
        </TransactionButton>

        {/* <Button
          onClick={() => saveListing(seller, tokenId, price, address, singleId)}
        >
          save listing
        </Button> */}
      </div>

      < FormError message={errorMessage} />
      <FormSuccess message={isSuccess} />
    </div>
  );
};
