"use client"
import React from 'react'
import SingleNft from './bought-single';
import { RelistNft } from './relist';
import { useRecoilValue } from 'recoil';
import { isConnected } from '@/atoms/session-atom';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { BoughtTable } from './bought-table';
import { MarketSkeleton } from '../marketplace/marketplace-skeleton';
import { BuyNFT } from '@/types';

const BoughtNFT = () => {
    //DELETE THE CASE CONVERSION
    try {


        const userId = useRecoilValue(isConnected).toLocaleLowerCase();

        const apiUrl = `/api/buynft/${userId}`;
        const { data: nfts, error, isLoading } = useSWR(apiUrl, fetcher);

        console.log(nfts, "from my bought nft")

        return (
            <div>
                <h2 className='text-center p-2'>My NFTs</h2>
                <div className="flex flex-wrap space-x-4 pb-4 w-full">
                    {
                        isLoading ? <MarketSkeleton /> :
                            nfts &&
                            nfts?.map((nft: BuyNFT, index: number) => (
                                <div className='w-full' key={index}>
                                    < BoughtTable
                                        data={nft}
                                    />
                                </div>
                            ))


                    }
                </div>

            </div>
        )

    } catch (error) {
        console.error(error)
    }
}

export default BoughtNFT