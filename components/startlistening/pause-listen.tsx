"use client"
import React from 'react'
import { Button } from '../ui/button'
import { startListening } from '@/actions/startListening'
import { endListening } from '@/actions/endListening'

export const PauseListen = ({ userId }: { userId: string }) => {
    const handlePause = () => {
        endListening(userId).then((data) => {
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
