"use client";
import React, { useEffect, useState } from 'react';
import { Tracktable } from '../musicNFTs/listedNFT/data-table';
import { ListedNFT } from '@/types';
import { useSession } from '@/hooks/useSession';
import { useRecoilValue } from 'recoil';
import { isConnected } from '@/atoms/session-atom';
import { useSearchParams } from 'next/navigation';
import { fetcher } from '@/lib/utils';
import useSWR from 'swr';
import { Skeleton } from '../ui/skeleton';

interface MarketPlaceProps {
    data: ListedNFT[];
}

const MarketPlace: React.FC = () => {
    const searchParams = useSearchParams()
    // Retrieve filters from the search params
    const filter = searchParams.get("filter")

    // Build API URL with dynamic filters based on search parameters
    const apiUrl = `/api/listednft?${new URLSearchParams({
        filter: filter || "",
    })}`

    console.log(apiUrl, "market places")

    const { data: songs, error, isLoading } = useSWR(
        apiUrl,
        fetcher
    );
    return (
        <div className='w-full'>
            {
                isLoading ? (
                    <div className='flex flex-col space-y-2'>
                        <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                            <Skeleton className='w-12 h-12 bg-[#111113]' />
                            <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-2/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                        </div>
                        <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                            <Skeleton className='w-12 h-12 bg-[#111113]' />
                            <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-2/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                        </div>
                        <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                            <Skeleton className='w-12 h-12 bg-[#111113]' />
                            <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-2/12 h-12 bg-[#111113]' />
                            <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                        </div>
                    </div>
                ) :
                    <Tracktable data={songs} />
            }

        </div>
    );
};

export default MarketPlace;
