import { client } from "@/lib/client";
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bscTestnet, sepolia } from "thirdweb/chains";
import { useState } from "react";
import { ListNFTForm } from "@/components/modal/list-nft";
import { AcceptBidOffer } from "@/components/actions/accept-offer";
// import { ListNFTForm } from "@/components/modal/list-nft";


export default function AllListed() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [openBidModal, setBidModal] = useState<boolean>(false)
    const handleModal = () => {
        setIsOpen(!isOpen)
    }


    // Prepare the contract call (write method)
    const { mutate: sendTransaction } = useSendTransaction();

    // Triggering the contract call to list an NFT
    const handleClick = async () => {
        setIsOpen(true)
    };
    const handleBid = async () => {
        setBidModal(true)
    }

    return (
        <div>
            <h1>List NFT on Marketplace</h1>
            <div className="space-x-3">
                <button onClick={handleClick}>list a song</button>
                <button onClick={handleBid}>Accept bid</button>
            </div>
            {
                openBidModal &&
                < AcceptBidOffer setBidModal={setBidModal} />
            }
            {
                isOpen &&
                <ListNFTForm setIsOpen={setIsOpen} />
            }
        </div>
    );
}
