"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
export const ArtiseHub = () => {
    const userId = useRecoilValue(isConnected)?.userId;
    const userName = useRecoilValue(isConnected)?.username;

    // Fetch user analytics
    const { data: analytics, error, isLoading } = useSWR(
        userId ? `/api/user/${userId}/analytics` : null,
        fetcher
    );
    
    return (
        <div>
            <ArtisteHeader />
        </div>
    )
}
