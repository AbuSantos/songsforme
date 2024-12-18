"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import { User } from '@/types';
import { Separator } from '../ui/separator';
import { ArtisteBody } from './artiste-body';

export const ArtisteHub = ({ artisteId, userData, count, userId }: { userId: string, userData: User, count: number, artisteId: string }) => {

    // Fetch user analytics
    const { data: analytics, error, isLoading } = useSWR(
        artisteId ? `/api/user/${artisteId}/analytics` : null,
        fetcher
    );

    return (
        <div>
            <ArtisteHeader name={userData?.username} followers={count} imageUri={userData?.bannerImage} bio={userData?.bio} artisteId={artisteId} analytics={analytics} />
            <Separator className='my-4' />
            <ArtisteBody artisteId={artisteId} analytics={analytics} />
        </div>
    )
}
