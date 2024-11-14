import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loader = () => {
    return (
        <div className='text-red-50 px-3'>
            <header className="md:flex w-full">

                <div className=" flex space-x-2 items-end px-4 w-full md:w-5/12 ">
                    < Skeleton className='w-[150] h-[150] rounded-md' />
                    <div className="text-gray-100">
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                    </div>
                </div>
                <div className="md:w-7/12 w-full">
                    <div className=" justify-center p-2 items-center space-x-2 space-y-2 w-full grid  grid-cols-2 gap-1">
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                        < Skeleton className='w-[80] h-[50] rounded-md' />
                    </div>
                </div>
            </header>
            <div className="mt-4 ">
                < Skeleton className='w-full h-[50] rounded-md' />
            </div>
        </div>

    )
}

export default Loader
