"use client"
import React from 'react'
import MiddlePlayer from '../mainplayer/middle-player'
import PlayerDetails from '../mainplayer/player-details'
import { VolumeControl } from '../mainplayer/volume-control'
import { fetcher } from '@/lib/utils'
import useSWR from 'swr'

const BottomNav = () => {

    const { data: tracks, error, isLoading } = useSWR('/api/listednft', fetcher)

    return (
        <div className='hidden md:flex justify-between items-center text-[var(--text)] px-8 bg-black p-4 bottom-0 fixed w-full mt-20'>
            <PlayerDetails tracks={tracks?.data} />
            <MiddlePlayer tracks={tracks?.data} />
            <VolumeControl />
        </div>
    )
}

export default BottomNav