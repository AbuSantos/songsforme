"use client"
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export const ArtisteForm = () => {
    return (
        <div className='space-y-4'>
            <div>
                <Label htmlFor='email'>Please Add you Email</Label>
                <Input type='email' placeholder='email' id='email' />
            </div>
            <div>
                <Label htmlFor='text'>Please Add you Wallet Address</Label>
                <Input type='email' placeholder='0x12345678901234567889' id='email' />
            </div>
        </div>
    )
}
