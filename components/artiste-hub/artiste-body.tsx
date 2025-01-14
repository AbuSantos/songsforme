"use client";

import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { AlbumArtwork } from '../dashboard/album-artwork';
import { ArtisteAnalytics, Single } from '@/types';
import { ArtisteChart } from './chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { MarketSkeleton } from '../marketplace/marketplace-skeleton';
import { Minter } from '../minter/minter';

type ArtisteBodyTypes = {
    artisteId: string;
    analytics: ArtisteAnalytics;
};

export const ArtisteBody = ({ artisteId, analytics }: ArtisteBodyTypes) => {
    const userId = useRecoilValue(isConnected)?.userId ?? "";
    const usrname = useRecoilValue(isConnected)?.username ?? "";

    // Check for who's viewing
    const isArtist = userId === artisteId;

    // Fetch singles
    const apiUrl = `/api/singles/${artisteId}`;
    const { data, isLoading, error } = useSWR<Single[]>(apiUrl, fetcher);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading singles. Please try again later.</p>;
    }

    try {

        const sortedData = data?.slice().sort((a, b) => {
            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();

            // Handle invalid dates by pushing them to the end
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return dateB - dateA;
        });

        const artistContent = (
            <Tabs defaultValue="analytics" className="h-full border-0 ">
                <div className="m-auto flex items-center justify-center">
                    <TabsList className="bg-black">
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="minter">Minter</TabsTrigger>
                        <TabsTrigger value="singles">All my Singles</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="stream border-gray-50 border-1">
                            {/* @ts-ignore */}
                            <ArtisteChart streams={analytics?.totalStreams} label="stream" />
                        </div>
                        <div className="fans border-gray-50 border-1">
                            {/* @ts-ignore */}
                            <ArtisteChart streams={analytics?.totalFans} label="fans" />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="singles">
                    <div className="mx-4">
                        {data &&
                            data.map((single: Single) => (
                                <AlbumArtwork key={single.id} album={single} className="w-[180px]" />
                            ))}
                    </div>
                </TabsContent>
                <TabsContent
                    value="minter"
                    className="border-none  outline-none px-2 "
                >
                    <div className=" bg-[#111111] space-x-2 ">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-semibold tracking-tight py-3">
                                MINTER
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                All Minted NFTS will be listed on the MarketPlace
                            </p>
                        </div>
                        <div>
                            <Separator className="my-4 w-full " />
                        </div>
                    </div>

                    <div className="w-full overflow-y-auto scroll-smooth scrollbar-none">
                        <Suspense fallback={<MarketSkeleton />}>
                            <Minter />
                        </Suspense>
                    </div>

                </TabsContent>
            </Tabs>
        );

        const nonArtistContent = (
            <Tabs defaultValue="all" className="h-full border-0 ">
                <div className="m-auto flex items-center justify-center">
                    <TabsList className="bg-black">
                        <TabsTrigger value="all">All Tracks</TabsTrigger>
                        <TabsTrigger value="new">New Release</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all">
                    <div className="mx-4">
                        {data &&
                            data?.map((single: Single) => (
                                <AlbumArtwork key={single.id} album={single} className="w-[180px]" />
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="new">
                    <div className="mx-4">
                        {data &&
                            sortedData?.map((single: Single) => (
                                <AlbumArtwork key={single.id} album={single} className="w-[180px]" />
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        );

        return <div className='py-4'>{isArtist ? artistContent : nonArtistContent}</div>;
    } catch (error) {
        console.log(error)
        return <p>Error loading singles. Please try again later.</p>;
    }


};
