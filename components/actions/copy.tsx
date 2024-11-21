import React from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export const Copy = ({ address, mode }: { address: string, mode?: string }) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(address)
        toast.success("Address Copied")
    }

    return (
        <Button className='bg-transparent border-none shadow-none hover:bg-transparent py-0 px-1 text-gray-300' onClick={handleCopy} aria-label='Copy Address'>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" style={{ fill: mode === "data" ? "#d1d5db" : "rgba(0, 0, 0, 1)", transform: "msFilter" }}><path d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"></path><path d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path></svg>
        </Button >
    )
}

