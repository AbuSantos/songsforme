"use server";
import React, { useEffect, useState } from 'react';
import { Tracktable } from '../musicNFTs/listedNFT/data-table';
import { ListedNFT } from '@/types';
import { useSession } from '@/hooks/useSession';
import { useRecoilValue } from 'recoil';
import { isConnected } from '@/atoms/session-atom';
import { db } from '@/lib/db';
import { revalidateTag } from 'next/cache';

interface MarketPlaceProps {
    data: ListedNFT[];
}

const MarketPlace: React.FC = async () => {
    const listedData: ListedNFT[] = await db.listedNFT.findMany({
        where: {
            sold: false
        }
    });
    revalidateTag("bought");

    return (
        <div className='w-full'>

            <div className='w-full'>
                <Tracktable data={listedData} />
            </div>
        </div>
    );
};

export default MarketPlace;
