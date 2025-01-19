"use client"
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export const ArtisteForm = () => {
    const [email, setEmail] = useState('')
    const [wallet, setWallet] = useState('')

    return (
        <div className='space-y-4'>
            <div>
                <Label htmlFor='email'>Please Add you Email</Label>
                <Input type='email'
                    placeholder='email'
                    id='email'
                    value={email}
                    // disabled={isPending}
                    className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <Label htmlFor='text'>Please Add you Wallet Address</Label>
                <Input
                    type='email'
                    placeholder='0x12345678901234567889'
                    id='email'
                    value={wallet}
                    className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    onChange={(e) => setWallet(e.target.value)}
                />
            </div>
            <Button  >
                Submit
            </Button>
        </div>
    )
}
