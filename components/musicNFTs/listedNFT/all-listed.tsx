import { client } from "@/lib/client";
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bscTestnet, sepolia } from "thirdweb/chains";
import { useState } from "react";
import { AcceptBidOffer } from "@/components/bids/accept-offer";
import { MakeBid } from "@/components/bids/make-bid";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { SelectPlaylist } from "@/components/playlists/selectplaylist";
export default function AllListed() {
    const [openBidModal, setBidModal] = useState<boolean>(false)

    const handleBid = async () => {
        setBidModal(true)
    }

    return (
        <div>
            {
                openBidModal &&
                < AcceptBidOffer setBidModal={setBidModal} />
            }

        </div>
    );
}
