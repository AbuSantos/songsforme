"use client"

import { Tracktable } from "@/components/musicNFTs/listedNFT/data-table"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type dataProps = {
    cover: string;
    name: string;
    title: string;
    url: string;
    artist: string;
    id: string;
}
const page = () => {
    const getPathname = usePathname()
    const trackId = getPathname.split("/").pop()
    const [track, setTrack] = useState<dataProps>()

    useEffect(() => {
        const fetchTrack = async () => {
            const response = await fetch(`http://localhost:4000/songs/${trackId}`)
            const data = await response.json();
            setTrack(data)
            return data
        }
        fetchTrack()
    }, [trackId])


    console.log(track)

    return (
        <div className='text-red-50 px-3'>
            <header className=" flex space-x-2 items-end px-4">
                <Image src={track?.cover} width={150} height={200} alt="cover" className="rounded-md" />
                <div className="text-gray-100">
                    <h1 className="text-2xl capitalize">{track?.title}</h1>
                    <p>{track?.artist}</p>
                </div>
            </header>
            <div className="mt-4">
                < Tracktable />
            </div>
        </div>

    )
}

export default page