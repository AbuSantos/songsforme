import React from 'react'
import { Tracktable } from '../musicNFTs/listedNFT/data-table'
import { getSession } from '@/lib/helper'
import { ListedNFT } from '@/types'

const MarketPlace = async ({ data }) => {
    const address = await getSession()
    if (!address) return

    return (
        <div className='w-full'>
            <div>

            </div>
            <div className=''>
                < Tracktable data={data} userId={address} />
            </div>
        </div>
    )
}

export default MarketPlace