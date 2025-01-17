import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ArtisteForm } from './artistes-form'
import Link from 'next/link'

export const MiddlePage = () => {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="form" className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A]">
                    <AccordionTrigger className="md:py-1 ">
                        Join Us
                    </AccordionTrigger>
                    <AccordionContent className="px-4 hidden md:block">
                        <ArtisteForm />
                    </AccordionContent>
                </AccordionItem>
                <Link className="text-gray-100  text-xl" href="/dashboard">
                    Explore
                </Link>
            </Accordion>

        </div>
    )
}
