import { client } from "@/lib/client";
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { bscTestnet, sepolia } from "thirdweb/chains";
import { useState } from "react";
import { ListNFTForm } from "@/components/modal/list-nft";
// import { ListNFTForm } from "@/components/modal/list-nft";


export default function AllListed() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleModal = () => {
        setIsOpen(!isOpen)
    }


    // Prepare the contract call (write method)
    const { mutate: sendTransaction } = useSendTransaction();

    // Triggering the contract call to list an NFT
    const handleClick = async () => {
        setIsOpen(true)
    };

    return (
        <div>
            <h1>List NFT on Marketplace</h1>
            <button onClick={handleClick}>list a song</button>
            {
                isOpen &&
                <ListNFTForm setIsOpen={setIsOpen} />
            }
        </div>
    );
}
