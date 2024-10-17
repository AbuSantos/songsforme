"use client"
import React from 'react'
import { Button } from '../ui/button'
import { startListening } from '@/actions/startListening'

export const Playlisten = ({ userId, nftId }) => {

    const handlePlay = () => {
        startListening(userId, nftId,).then((data) => {
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
