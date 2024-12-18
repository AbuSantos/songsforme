"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import { User } from '@/types';
import { Separator } from '../ui/separator';
import { ArtisteBody } from './artiste-body';

interface ArtisteGraph {
    userId: string,
    userData: Partial<User>,
    count: number,
    artisteId: string
}
export const ArtisteHub = ({ artisteId, userData, count, userId }: ArtisteGraph) => {

    // Fetch user analytics
    const { data: analytics, error, isLoading } = useSWR(
        artisteId ? `/api/user/${artisteId}/analytics` : null,
        fetcher
    );

    console.log(userData, "from hub")

    return (
        <div className='space-y-0'>
            <ArtisteHeader name={userData?.username} followers={count} imageUri={userData?.bannerImage} bio={userData?.bio} artisteId={artisteId} analytics={analytics} profilePic={userData?.profilePicture} />
            <ArtisteBody artisteId={artisteId} analytics={analytics} />
        </div>
    )
}
