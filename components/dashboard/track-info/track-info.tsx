import { amountGenerated, countPlays } from '@/lib/utils'
import { ListedNFT } from '@/types'

export const TrackInfo = ({ data }: ListedNFT) => {

    const plays = countPlays(data?.totalAccumulatedTime || 0)
    const amount = amountGenerated(data?.totalAccumulatedTime)

    return (
        <div className="flex justify-between p-2 items-center flex-wrap space-x-2 space-y-2">
            <div className="flex flex-col items-center justify-center p-2 space-x-2">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">current price</small>
                <p className="text-[1rem] uppercase font-medium">{data?.price}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">plays</small>
                <p className="text-[1rem] uppercase font-medium">{plays}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">amount </small>
                <p className="text-[1rem] uppercase font-medium">{amount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 space-x-2">
                <small className="uppercase text-[#7B7B7B] text-[0.6rem] tracking-wide">creator</small>
                <p className="text-[1rem] uppercase font-medium">creator </p>
            </div>
        </div>
    )
}

