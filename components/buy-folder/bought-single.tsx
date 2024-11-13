import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
//@ts-ignore
const SingleNft = ({ data }) => {
    return (
        <div className='flex'>
            <Link className="space-y-1" href={`dashboard/tracklist/${data.id}`}>
                <Image
                    src="https://unsplash.com/photos/a-woman-in-a-fur-coat-singing-into-a-microphone-TlvLy_OmqHA"
                    width={100}
                    height={100}
                    alt="Music"
                    className="block dark:hidden rounded-md cursor-pointer"
                // onClick={() => setOpenTrack(!openTrack)}
                />
                <p className="text-sm capitalize text-slate-500">
                    {data.price}
                </p>
                <p className="text-[0.7rem] capitalize text-slate-500">
                    {data.status}
                </p>
            </Link>
        </div>
    )
}

export default SingleNft