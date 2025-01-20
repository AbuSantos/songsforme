"use client"
import { useState, FormEvent, useTransition } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { sendArtistesForm } from '@/actions/artistesforms/submit-form'
import { toast } from 'sonner'
import { FormSuccess } from '../errorsandsuccess/form-success'
import { sendCongratulatoryEmail } from '@/actions/emails/congratulatory-email'

export const ArtisteForm = () => {
    const [email, setEmail] = useState('')
    const [wallet, setWallet] = useState('')
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const sendEmail = async (e: FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const response = await sendArtistesForm(email, wallet)
            if (response.status === 'error') {
                toast.error('Failed to send email. Please try again later.')
            } else if (response.status === 'success') {
                toast.success('Email sent successfully, we will get back to you soon.')
                setWallet('')
                setEmail('')
            }

        })
    }

    return (
        <div className='space-y-4'>
            <form onSubmit={sendEmail}>
                <div className='mb-3'>
                    <Label htmlFor='email' className='text-start p-2'>Please Add you Email</Label>
                    <Input type='email'
                        placeholder='email'
                        id='email'
                        value={email}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isPending}
                    />
                </div>
                <div className='mb-3'>
                    <Label htmlFor='text' className='text-start p-2'>Please Paste your Wallet Address</Label>
                    <Input
                        type='text'
                        placeholder='0x12345678901234567889'
                        id='text'
                        value={wallet}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        onChange={(e) => setWallet(e.target.value)}
                        disabled={isPending}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <FormSuccess message={isSuccess} />
                <Button type="submit" size="lg" variant="outline" className="w-full text-gray-900 mt-4" >
                    Submit
                </Button>
            </form>
        </div>
    )
}
