import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ArtisteForm } from './artistes-form'
import Link from 'next/link'

export const MiddlePage = () => {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <div className='md:py-1 items-center justify-center text-center pb-4'>
                    <Link className="mt-6 px-10 py-4 bg-blue-400 text-gray-900 rounded-xl hover:bg-blue-500 transition" href="/dashboard">
                        Explore
                    </Link>
                </div>
                <AccordionItem value="form" className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A] mt-4">
                    <AccordionTrigger className="md:py-1 bg-[##191919] px-3 rounded-md">
                        <h1 className='text-gray-100 text-2xl md:text-2xl font-semibold text-center'>
                            Join Us (For Artistes Only)
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                        <ArtisteForm />
                    </AccordionContent>
                </AccordionItem>


            </Accordion>

        </div>
    )
}
