"use client"

import { ArtisteHeader } from './artiste-header'
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { isConnected } from '@/atoms/session-atom';
import { fetcher } from '@/lib/utils';
export const ArtiseHub = ({ userId }: { userId: string }) => {

    // Fetch user analytics
    const { data: analytics, error, isLoading } = useSWR(
        userId ? `/api/user/${userId}/analytics` : null,
        fetcher
    );

    console.log(analytics)

    return (
        <div>
            <ArtisteHeader />
        </div>
    )
}
