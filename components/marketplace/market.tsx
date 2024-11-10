"use client";
import React from 'react';
import { Tracktable } from '../musicNFTs/listedNFT/data-table';
import { ListedNFT } from '@/types';
import { useSearchParams } from 'next/navigation';
import { fetcher } from '@/lib/utils';
import useSWR from 'swr';
import { Skeleton } from '../ui/skeleton';

const MarketPlace: React.FC = () => {
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");

    // Build API URL with dynamic filters based on search parameters
    const apiUrl = `/api/listednft?${new URLSearchParams({
        filter: filter || "",
    })}`;

    // Fetch songs data using SWR
    const { data: songs, error } = useSWR(apiUrl, fetcher, { revalidateOnFocus: false, refreshInterval: 0 });

    // Handle loading state
    const isLoading = !songs && !error;

    return (
        <div className='w-full'>
            {
                isLoading ? (
                    <div className='flex flex-col space-y-2'>
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md "
                            >
                                <Skeleton className='w-12 h-12 bg-[#111113]' />
                                <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                                <Skeleton className='w-2/12 h-12 bg-[#111113]' />
                                <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-500">Failed to load data.</div>
                ) : (
                    <Tracktable data={songs} />
                )
            }
        </div>
    );
};

export default MarketPlace;
