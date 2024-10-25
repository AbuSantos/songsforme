import { db } from '@/lib/db';
import { getSession } from '@/lib/helper';
import React from 'react'
import SingleNft from './bought-single';
import { RelistNft } from './relist';

const BoughtNFT = async () => {
    const address = await getSession()

    let nfts = []
    if (address) {
        nfts = await db.buyNFT.findMany({
            where: {
                buyer: address,  
                relisted: false
            },
            include: {
                listedNft: {
                    include: {
                        Single: true,

                    }
                },
            },
        });
    }
    console.log(nfts, "my bought nft")

    if (!nfts) {
        return <div>You own no nft</div>
    }
    return (
        <div>
            <h2 className='text-center p-2'>My NFTs</h2>
            <div className="flex flex-wrap space-x-4 pb-4">
                {
                    nfts && nfts.map((nft, index) => (
                        < RelistNft key={index} nft={nft} />
                    ))
                }
            </div>

        </div>
    )
}

export default BoughtNFT