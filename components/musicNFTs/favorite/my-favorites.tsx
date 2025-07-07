"use client"
import { listedNFT } from '@/actions/listNFT';
// import { Playlisten } from '@/components/startlistening/play-listen';
import { fetcher } from '@/lib/utils';
import { Favorites, ListedNFT } from '@/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import useSWR from 'swr';

const Playlisten = dynamic(
    () => import("../../../components/startlistening/play-listen").then((mod) => mod.Playlisten),
    { ssr: false, loading: () => <div className="w-6 h-6" /> }
);

export const MyFavorite = ({ userId }: { userId: string | undefined }) => {

    const { data: favorites, error, isLoading } = useSWR(
        userId ? `/api/favorites/${userId}` : null,
        fetcher
    );

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>Failed to load favorites. Please try again later.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center  p-4">
                <p>Loading...</p>
            </div>
        )
    }

    try {
        return (
            <div>
                {favorites && favorites?.map((track: Favorites, index: number) => (
                    < div key={index} className="flex items-center justify-center md:justify-between text-[#fffafa] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE]   px-2 py-2 w-full mt-2 text-start rounded-md ">
                        <Link href={`/dashboard/trackinfo/${track?.listednft?.id}`} className="flex items-center ">
                            <div className="flex flex-col ">
                                <small className="uppercase text-[0.7rem] ">
                                    {track?.listednft?.Single?.artist_name}
                                </small>
                            </div>
                            <div className="flex items-center justify-center  w-4/12">
                                <span>
                                    {track?.listednft?.price}
                                </span>
                            </div>
                        </Link>
                        <div className="items-center space-x-2 flex ml-2">
                            <Playlisten userId={userId} nftId={track?.id} nftContractAddress={track?.listednft?.contractAddress} tokenId={track?.listednft?.tokenId} />
                        </div>
                    </div>
                ))
                }
            </div>
        )
    } catch (error: any) {
        return <div>{error.message}</div>
    }

}
