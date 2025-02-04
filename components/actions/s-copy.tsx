import React from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export const SCopy = ({ address, mode }: { address: string | "", mode?: string }) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(address)
        toast.success("Address Copied")
    }
    return (
        <Button className='bg-[var(--button-bg)] border-none shadow-none  py-0 px-3 text-gray-300 md:hidden' onClick={handleCopy} aria-label='Copy Address'>
            Copy Address
        </Button >
    )
}

