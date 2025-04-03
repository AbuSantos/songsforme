import React from 'react'
import { Skeleton } from '../ui/skeleton'

export const MarketSkeleton = () => {
    return (
        <div className='flex flex-col space-y-2 w-full mt-5'>
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
    )
}
