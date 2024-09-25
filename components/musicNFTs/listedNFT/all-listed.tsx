import { client } from "@/lib/client";
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bscTestnet, sepolia } from "thirdweb/chains";
import { useState } from "react";
import { AcceptBidOffer } from "@/components/actions/accept-offer";
import { BuyNft } from "@/components/actions/buy-nft";
import { MakeBid } from "@/components/modal/make-bid";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
export default function AllListed() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [openBidModal, setBidModal] = useState<boolean>(false)

    const handleBid = async () => {
        setBidModal(true)
    }

    return (
        <div>
            <div className="space-x-3 space-y-3  items-center">
                {/* <button onClick={handleBid}>Accept bid</button> */}
                <BuyNft />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="text-gray-800" size="nav">Bid for NFT</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <MakeBid />
                    </PopoverContent>
                </Popover>
                <Button className="bg-gray-200 text-gray-950 hover:bg-gray-950 hover:text-gray-200">
                    Add to playlist
                </Button>
            </div>
            {
                openBidModal &&
                < AcceptBidOffer setBidModal={setBidModal} />
            }

        </div>
    );
}
