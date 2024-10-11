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
interface singleIdProps {
  singleId?: string
}
export const DesktopNFTForm = ({ singleId }: singleIdProps) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState<string>("");
  const [address, setAddress] = useState("0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0");
  // const [address, setAddress] = useState("0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30");
  const [tokenId, setTokenId] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<string>("");

  const seller = "0xC7fe86c79f9598C0a5A3874D075A1607686944D3"

  const saveListing = async (seller: string, tokenId: number, price: string, nftAddress: string, singleId?: string) => {

    startTransition(() => {
      try {
        listedNFT(seller, tokenId.toString(), price, nftAddress, singleId).then((data) => {
          toast.success("NFT listed successfully!");
          console.log(data);
        });
      } catch (error) {
        setErrorMessage("Failed to save transaction. Network.");
        return null;
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

        {/* <TransactionButton

          transaction={() => {
            const priceInWei = ethers.utils.parseEther(price);

            const tx = prepareContractCall({
              contract,
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
          onError={(error) => setErrorMessage(error.message)}
        >
          Confirm Listing
        </TransactionButton> */}

        <Button
          onClick={() => saveListing(seller, tokenId, price, address, singleId)}
        >
          save listing
        </Button>
      </div>

      < FormError message={errorMessage} />
      <FormSuccess message={isSuccess} />
    </div>
  );
};
