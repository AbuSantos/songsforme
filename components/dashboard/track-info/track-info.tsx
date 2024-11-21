"use client"
import { isConnected } from '@/atoms/session-atom'
import { AllBids } from '@/components/bids/all-bids'
import { EditRatio } from '@/components/playlists/playlist-info/edit-ratio'
import { amountGenerated, countPlays } from '@/dynamic-price/helper/play-count'
import { ListedNFT } from '@/types'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'

export const TrackInfo = ({ data }: { data: ListedNFT }) => {
    const userId = useRecoilValue(isConnected);
    const plays = countPlays(data?.totalAccumulatedTime || 0)
    const amount = amountGenerated(data?.totalAccumulatedTime!)

    return (
        <div className=" justify-center p-2 items-center space-x-2 space-y-2 w-full grid  grid-cols-2 gap-1">
            <div className="flex flex-col items-center justify-center p-2 space-x-2 border-[1px] w-full border-[#7B7B7B] rounded-md">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">current price</small>
                <p className="text-[1rem] uppercase font-medium flex items-center space-x-1 justify-center">

                    {data?.price}
                    <Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={15} height={15} className='ml-2' />
                </p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[1px] border-[#7B7B7B] rounded-md">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">plays</small>
                <p className="text-[1rem] uppercase font-medium flex items-center space-x-1 justify-center">

                    {plays}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#B4B4B4", transform: "msFilter" }}><path d="M7 6v12l10-6z"></path></svg>

                </p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[1px] border-[#7B7B7B] rounded-md">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">amount Earned</small>
                <p className="text-[1rem] uppercase font-medium flex items-center space-x-1 justify-center">
                    {amount}
                    <Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={15} height={15} className='ml-2' />
                </p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[1px] border-[#7B7B7B] rounded-md">
                <div className='flex w-full'>
                    <small className="flex-1 text-center uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">Check Bids</small>
                    <span className='cursor-pointer text-[0.7rem] text-red-600'>
                        4
                    </span>
                </div>
                < AllBids tokenId={data?.tokenId} nftAddress={data?.contractAddress} userId={userId} seller={data?.seller} />
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[1px] border-[#7B7B7B] rounded-md">
                <div className='flex w-full'>
                    <small className="flex-1 text-center uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">current ratio</small>
                    <span className='cursor-pointer '>
                        {
                            data?.seller === userId &&
                            <EditRatio trackId={data?.id} mode="track" />
                        }
                    </span>
                </div>
                <p className="text-[1rem] uppercase font-medium">{data?.rewardRatio} </p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2 w-full border-[1px] border-[#7B7B7B] rounded-md">
                <div className='flex w-full'>
                    <small className="flex-1 text-center uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">playlist ratio</small>
                    <span className='cursor-pointer '>

                        {
                            data?.seller === userId &&
                            <EditRatio trackId={data?.id} mode="track-playlist" />
                        }
                    </span>
                </div>
                <p className="text-[1rem] uppercase font-medium">{data?.playlistRewardRatio} </p>
            </div>


        </div>
    )
}

