"use client"
import React from 'react'
import { Button } from '../ui/button'
import { endListening } from '@/actions/endListening'

type PauseIdTypes = {
    userId: string
    playlistId: string
}

export const PauseListen = ({ userId, playlistId }: PauseIdTypes) => {
    const handlePause = () => {
        endListening(userId, playlistId).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.error("Error:", error);
        })
    }
    return (
        <div>
            <Button onClick={handlePause}>
                stop
            </Button>
        </div>
    )
}
