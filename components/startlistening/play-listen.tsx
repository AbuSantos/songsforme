"use client"
import React from 'react'
import { Button } from '../ui/button'
import { startListening } from '@/actions/startListening'

type PlaylistIdTypes = {
    userId: string
    playlistId: string
    nftId: string
}
export const Playlisten = ({ userId, nftId, playlistId }: PlaylistIdTypes) => {

    const handlePlay = () => {
        startListening(userId, nftId, playlistId).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.error("Error:", error);
        })
    }
    return (
        <div>
            <Button onClick={handlePlay}>
                start
            </Button>
        </div>
    )
}
