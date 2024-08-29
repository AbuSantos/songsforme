import React from 'react'
import MiddlePlayer from '../mainplayer/middle-player'
import PlayerDetails from '../mainplayer/player-details'
import { VolumeControl } from '../mainplayer/volume-control'

const BottomNav = () => {
    return (
        <div className='flex justify-between items-center text-[var(--text)] px-8 bg-[var(--bg)] p-2'>
            <PlayerDetails />
            <MiddlePlayer />
            <VolumeControl />
        </div>
    )
}

export default BottomNav