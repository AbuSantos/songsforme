"use client"
import { useState, FormEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { sendArtistesForm } from '@/actions/artistesforms/submit-form'
import { toast } from 'sonner'

export const ArtisteForm = () => {
    const [email, setEmail] = useState('')
    const [wallet, setWallet] = useState('')
    const [error, setError] = useState(null)

    const sendEmail = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const response = await sendArtistesForm(email, wallet)
            if (response.error) {
                toast.error('Failed to send email. Please try again later.')
            } else {
                toast.success('Email sent successfully, we will get back to you soon.')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to send email. Please try again later.')
        }
    }

    return (
        <div className='space-y-4'>
            <form onSubmit={sendEmail}>
                <div>
                    <Label htmlFor='email'>Please Add you Email</Label>
                    <Input type='email'
                        placeholder='email'
                        id='email'
                        value={email}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor='text'>Please Paste your Wallet Address</Label>
                    <Input
                        type='text'
                        placeholder='0x12345678901234567889'
                        id='text'
                        value={wallet}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        onChange={(e) => setWallet(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" size="lg" variant="outline" className="w-full text-gray-900 mt-2" >
                    Submit
                </Button>
            </form>
        </div>
    )
}
