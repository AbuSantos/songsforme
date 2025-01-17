import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ArtisteForm } from './artistes-form'
import Link from 'next/link'

export const MiddlePage = () => {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="form" className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A]">
                    <AccordionTrigger className="md:py-1 bg-[##191919] px-3 rounded-md">
                        <h1 className='text-gray-100 text-2xl md:text-2xl font-semibold text-center'>
                            Join Us (For Artistes Only)
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 hidden md:block">
                        <ArtisteForm />
                    </AccordionContent>
                </AccordionItem>
                <div className='md:py-1 items-center justify-center text-center'>
                    <Link className="text-gray-100 text-center  text-2xl" href="/dashboard">
                        Explore
                    </Link>
                </div>

            </Accordion>

        </div>
    )
}
