"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
import { User } from '@/types';
import { Separator } from '../ui/separator';
import { ArtisteBody } from './artiste-body';
import { ifError } from 'assert';


export const MyArtisteHub = () => {
    const userId = useRecoilValue(isConnected)?.userId;

    // Fetch user analytics
    const { data: analytics, error, isLoading } = useSWR(
        userId ? `/api/user/${userId}/analytics` : null,
        fetcher
    );
    const { data: user, error: userError, isLoading: loadingUser } = useSWR(
        userId ? `/api/user/${userId}` : null,
        fetcher
    );
    const { data: count, error: CountError, isLoading: countLoading } = useSWR(
        userId ? `/api/user/${userId}/follow` : null,
        fetcher
    );

    if (isLoading && loadingUser && countLoading) {
        return <p>loading...</p>
    }
    if (userError || CountError) {
        return <p>Error loading page...</p>
    }

    return (
        <div className='space-y-0'>
            <ArtisteHeader name={user?.username} followers={count} imageUri={user?.bannerImage} bio={user?.bio} artisteId={userId || ""} analytics={analytics} profilePic={user?.profilePicture} />
            <ArtisteBody artisteId={userId || ""} analytics={analytics} />
        </div>
    )
}
