"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import { User } from '@/types';
export const ArtiseHub = ({ artisteId, userData, count }: { userId: string, userData: User, count: number, artisteId: string }) => {

    // Fetch user analytics
    // const { data: analytics, error, isLoading } = useSWR(
    //     userId ? `/api/user/${userId}/analytics` : null,
    //     fetcher
    // );

    return (
        <div>
            <ArtisteHeader name={userData?.username} followers={count} imageUri={userData?.bannerImage} bio={userData?.bio} artisteId={artisteId} />
        </div>
    )
}
