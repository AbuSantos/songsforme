import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ArtisteForm } from './artistes-form'
import Link from 'next/link'
import { Button } from '../ui/button'

export const MiddlePage = () => {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <div className='md:py-1 items-center justify-center text-center pb-4'>
                    <Button type="submit" size="lg" variant="outline" className="w-full bg-blue-400  text-gray-900  hover:bg-blue-500 border-none text-xl  transition" >
                        <Link href="/dashboard">
                            Explore
                        </Link>
                    </Button>
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
