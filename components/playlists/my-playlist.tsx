"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { Skeleton } from "@/components/ui/skeleton"

export const MyPlaylist = ({ data }: any) => {

    return (

        <Accordion type="single" collapsible className="w-full">
            {/* <Skeleton className="h-12 w-full bg-gray-800" /> */}
            {
                data.map((item: any, index: number) => (
                    <AccordionItem key={item.id} value={String(index)} className="border-b-[0.5px] border-b-[#2A2A2A]">
                        <AccordionTrigger>
                            <div className="flex justify-between text-[#7B7B7B] items-center bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE]  px-2 py-4 w-full text-start rounded-md ">
                                <p className="text-[1rem] capitalize">
                                    {item.name}
                                </p>
                                <small>
                                    {item?.listednft?.length}
                                </small>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                            Track Details:  tracks
                        </AccordionContent>
                    </AccordionItem>
                ))
            }

        </Accordion>
    )

}