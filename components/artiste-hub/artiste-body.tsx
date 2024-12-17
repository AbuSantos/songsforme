"use client"

import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import React from 'react'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { AlbumArtwork } from '../dashboard/album-artwork';
import { Single } from '@/types';


export const ArtisteBody = ({ artisteId }: { artisteId: string }) => {
    const userId = useRecoilValue(isConnected)?.userId;
    const usrname = useRecoilValue(isConnected)?.username
    //check for who's viewing
    const isArtist = userId === artisteId


    const apiUrl = `/api/singles/${artisteId}`
    const { data, isLoading, error } = useSWR(
        `/api/singles/${artisteId}`
        , fetcher)

    console.log(data, "artistebody")
    console.log(artisteId);


    // const content = isArtist?
    //         <>

    //         </>
    if (isLoading) {
        return <p>loading...</p>
    }

    const content = !isArtist ? <>
        {
            data && data.map((single: Single) => <AlbumArtwork
                key={single.id}
                album={single}
                className="w-[180px]"
            />)
        }
    </> : ""

    //    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
    //    <div className="stream border-gray-50 border-1 h-32 w-16"></div>
    //    <div className="earning border-gray-50 border-1 h-32 w-16"></div>
    //    <div className="releases border-gray-50 border-1 h-32 w-16"></div>
    //    <div className="followers border-gray-50 border-1 h-32 w-16"></div>
    // </div>
    // <div>

    // </div>


    return (
        <div>
            {content}
        </div>
    )
}
