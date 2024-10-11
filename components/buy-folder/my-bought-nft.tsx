import { db } from '@/lib/db';
import { getSession } from '@/lib/helper';
import React from 'react'
import SingleNft from './bought-single';

const BoughtNFT = async () => {
    const address = await getSession()
    const nfts = await db.buyNFT.findMany({
        where: {
            buyer: address,  // Filter by buyer's wallet address
        },
        include: {
            listedNft: {
                include: {
                    Single: true
                }
            },  // Include the related NFT details from the ListedNFT model
        },
    });
    console.log(nfts)
    if (!nfts) {
        return <div>You own no nft</div>
    }
    return (
        <div>
            <h2 className='text-center p-2'>My NFTs</h2>
            <div className="flex flex-wrap space-x-4 pb-4">
                {
                    nfts && nfts.map((nft, index) => (
                        <SingleNft
                            data={nft}
                            key={nft.id}
                        />

                    ))
                }
            </div>

        </div>
    )
}

export default BoughtNFT