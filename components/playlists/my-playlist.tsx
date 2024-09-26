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
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const MyPlaylist = () => {
    const [data, setData] = useState([])
    const userId = useActiveAccount()
    const address = userId?.address
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {

        const fetchData = async () => {

            if (!address) return;
            try {

                const res = await fetch(`/api/playlists/${address}/`);

                const result = await res.json();

                setData(result);

            } catch (error) {

                console.error("Error fetching playlists:", error);

            } finally {

                setLoading(false);

            }

        };



        fetchData();

    }, [address]);



    console.log(data)

    return (

        <Accordion type="single" collapsible className="w-full">
            {loading ? (
                <>
                    <Skeleton className="h-12 w-full bg-gray-800" />
                </>
            ) : data && data.length > 0 ? (
                data.map((item, index) => (
                    <AccordionItem key={item.id} value={String(index)}>
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

            ) : (

                <p>No playlists found.</p>

            )}

        </Accordion>

    )

}