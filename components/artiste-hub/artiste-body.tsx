"use client"

import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import React from 'react'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { AlbumArtwork } from '../dashboard/album-artwork';
import { ArtisteAnalytics, Single } from '@/types';
import { ArtisteChart } from './chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type ArtisteBodyTypes = {
    artisteId: string,
    analytics: ArtisteAnalytics
}

export const ArtisteBody = ({ artisteId, analytics }: ArtisteBodyTypes) => {
    const userId = useRecoilValue(isConnected)?.userId;
    const usrname = useRecoilValue(isConnected)?.username

    //check for who's viewing
    const isArtist = userId === artisteId

    const apiUrl = `/api/singles/${artisteId}`
    const { data, isLoading, error } = useSWR(
        apiUrl
        , fetcher)

    if (isLoading) {
        return <p>loading...</p>
    }

    const content = !isArtist ? <div className='mx-4'>

        {
            data && data.map((single: Single) => <AlbumArtwork
                key={single.id}
                album={single}
                className="w-[180px]"
            />)
        }
    </div> : (
        < div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2' >
            <div className="stream border-gray-50 border-1 ">
                < ArtisteChart streams={analytics?.totalStreams} />
            </div>
        </div>
    )


    return (
        <div>
            {
                isArtist && <Tabs defaultValue="analytics" className="h-full border-0 ">
                    <div className='m-auto flex items-center justify-center'>

                        <TabsList className='bg-black'>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="singles">All my Singles</TabsTrigger>
                        </TabsList>

                    </div>

                    <TabsContent value="analytics">
                        < div className='grid grid-cols-1 md:grid-cols-2 gap-2' >
                            <div className="stream border-gray-50 border-1 ">
                                < ArtisteChart streams={analytics?.totalStreams} label="stream" />
                            </div>
                            <div className="fans border-gray-50 border-1 ">
                                < ArtisteChart streams={analytics?.totalFans} label="fans" />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="singles">
                        <div className='mx-4'>
                            {
                                data && data.map((single: Single) => <AlbumArtwork
                                    key={single.id}
                                    album={single}
                                    className="w-[180px]"
                                />)
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            }
            {
                !isArtist && <div>
                    {content}
                </div>
            }

        </div>
    )
}
