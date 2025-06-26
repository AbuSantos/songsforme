import React from 'react'
import MiddlePlayer from '../mainplayer/middle-player'
import PlayerDetails from '../mainplayer/player-details'
import { VolumeControl } from '../mainplayer/volume-control'
import { db } from '@/lib/db'

const BottomNav = async () => {
    const tracks = await db.listedNFT.findMany({
        select: {
            id: true,
            tokenId: true,
            listedAt: true,
            seller: true,
            price: true,
            contractAddress: true,
            isSaleEnabled: true,
            Single: {
                select: {
                    song_name: true,
                    artist_name: true,
                    song_cover: true,
                    genre: true,
                },
            },
        }
    })

    



    return (
        <div className='hidden md:flex justify-between items-center text-[var(--text)] px-8 bg-black p-4 bottom-0 fixed w-full mt-20'>
            <PlayerDetails />
            <MiddlePlayer tracks={tracks} />
            <VolumeControl />
        </div>
    )
}

export default BottomNav