"use client"
import { amountGenerated, countPlays, totalPlayTime } from '@/dynamic-price/helper/play-count'
import { Playlist } from '@/types'
import Image from 'next/image'
import { EditRatio } from './edit-ratio'
import { useRecoilValue } from 'recoil'
import { isConnected } from '@/atoms/session-atom'

export const PlaylistInfo = ({ data }: { data: Playlist }) => {

    console.log("PlaylistInfo component initialized with data:", data);
    const userId = useRecoilValue(isConnected)?.userId;
    try {
        const plays = countPlays(data?.accumulatedTime || 0)
        const amount = amountGenerated(data?.accumulatedTime!)
        const timeLine = totalPlayTime(data?.listednft?.length)

        return (
            <div className=" justify-center p-2 items-center space-x-2 space-y-2 w-full grid  grid-cols-2 gap-1">
                <div className="flex flex-col items-center justify-center p-2 space-x-2 border-[0.5px] w-full border-[#222222] rounded-md">
                    <div className='flex w-full'>
                        <small className="flex-1 text-center uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">current ratio</small>
                        <span className='cursor-pointer '>
                            {
                                data?.userId === userId &&
                                < EditRatio playlistId={data?.id} mode='playlist' />
                            }
                        </span>
                    </div>
                    <p className="text-[1rem] uppercase font-medium flex items-center space-x-1 justify-center">
                        {data?.rewardRatio}
                    </p>

                </div>
                <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[0.5px] border-[#222222] rounded-md">
                    <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">plays</small>
                    <p className="text-[1rem] uppercase font-medium flex items-center space-x-1 justify-center">

                        {plays}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#B4B4B4", transform: "msFilter" }}><path d="M7 6v12l10-6z"></path></svg>

                    </p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[0.5px] border-[#222222] rounded-md">
                    <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">amount Earned</small>
                    <p className="text-[0.8rem] uppercase font-medium flex items-center space-x-1 justify-center">
                        {amount}
                        <Image src={"/base-logo.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[0.5px] border-[#222222] rounded-md">
                    <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">owner</small>
                    <p className="text-[0.8rem] uppercase font-medium"> {data?.owner?.username} </p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[0.5px] border-[#222222] rounded-md">
                    <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">timeline</small>
                    <p className="text-[1rem] uppercase font-medium"> {timeLine} </p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[0.5px] border-[#222222] rounded-md">
                    <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">listeners</small>
                    <p className="text-[1rem] uppercase font-medium"> {data?.owner?.username} </p>
                </div>
            </div>
        )
    } catch (error: any) {
        console.log(error)
        return (
            <p>{error.message}</p>
        )
    }


}

