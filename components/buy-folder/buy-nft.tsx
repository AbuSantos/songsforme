import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { contract } from "@/lib/client";
import { useTransition } from "react";
import { buyNFT } from "@/actions/buy-song";

// Interface defining the props for the BuyNFT component
interface NFTProps {
    nftAddress: string; // The address of the NFT contract
    tokenId: number;    // The unique identifier for the NFT being purchased
    price: number;      // The price of the NFT in Ether (as a number)
    listedNftId: string
}

// BuyNFT Component for handling the purchase of an NFT on the blockchain
export const BuyNFT = ({ nftAddress, tokenId, price, listedNftId }: NFTProps) => {
    const [isPending, startTransition] = useTransition();
    const buyer = "0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0"
    const transactionHash = "0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0"

    console.log(listedNftId)
    const handleBuyNft = () => {
        startTransition(() => {
            try {
                buyNFT(buyer, price, listedNftId, transactionHash).then((data) => {
                    toast.success("NFT purchased successfully!");
                })
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong", error)
                return null;
            }
        })
    }

    return (
        <div>
            {/* TransactionButton is a wrapper from thirdweb to handle blockchain transactions */}


            <Button onClick={handleBuyNft}>
                buy now
            </Button>
        </div>
    );
};
