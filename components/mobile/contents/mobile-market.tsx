import { FilterByName } from '@/components/marketplace/filter/filter-by-name'
import MarketPlace from '@/components/marketplace/market'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { ListedNFT } from '@/types'
import React from 'react'

export const MobileMarket = async () => {
    //@ts-ignore
    const listedData: ListedNFT[] = await db.listedNFT.findMany({
        where: {
            sold: false
        }
    });
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#B4B4B4]">
                        Buy and Sell Music NFTS
                    </h2>
                    <small className="text-[0.7rem] md:text-sm text-[#6E6E6E]">
                        create playlist and earn
                    </small>
                </div>

                <div>
                    {/* @ts-ignore */}
                    <FilterByName items={listedData} />
                </div>
            </div>
            <Separator className="my-4 bg-[#7B7B7B]" />
            <div className="relative">
                <ScrollArea>
                    <div className="flex flex-wrap space-x-4 pb-4">
                        < MarketPlace />
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    )
}

