import React from 'react'
import { Tracktable } from '../musicNFTs/listedNFT/data-table'

const MarketPlace = ({ data }) => {

    return (
        <div className='w-full'>

            <div>

            </div>
            <div className=''>
                < Tracktable data={data} />
            </div>
        </div>
    )
}

export default MarketPlace