"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { db } from "@/lib/db"
import { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"

export const MyPlaylist = () => {
    const [data, setData] = useState()
    const userId = useActiveAccount()

    useEffect(() => {
        const fetchData = async () => {
            if (!userId?.address) return; // Ensure the address is available

            try {
                const res = await fetch(`/api/playlists/${userId?.address}/`);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };
        fetchData()
    }, [userId])

    console.log(data)
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                data?.map((item, index) => (
                    <AccordionItem value={index + 1}>
                        <AccordionTrigger>
                            <p className="bg-slate-900 px-2 py-4 w-full text-start rounded-md text-[1rem] capitalize">
                                {item.name}
                            </p>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                            Track Details
                        </AccordionContent>
                    </AccordionItem>
                ))
            }

        </Accordion>
    )
}
