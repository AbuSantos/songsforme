import { amountGenerated, countPlays } from '@/dynamic-price/helper/play-count'
import { ListedNFT } from '@/types'
import Image from 'next/image'

export const TrackInfo = ({ data }: ListedNFT) => {

    const plays = countPlays(data?.totalAccumulatedTime || 0)
    const amount = amountGenerated(data?.totalAccumulatedTime)

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
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">creator</small>
                <p className="text-[1rem] uppercase font-medium">creator </p>
            </div>
        </div>
    )
}

