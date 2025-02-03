import React from 'react'
import { Separator } from '../ui/separator'
import { WithdrawRewards } from '../withdraw/withdrawal'
import { User } from '@/types';
import Image from 'next/image';

export const MyEarnings = ({ data }: { data: User }) => {
    const PAY_RATE = 0.001;
    const earnings = (data?.accumulatedTime || 0) * PAY_RATE;
    return (
        <div className="my-2 w-full">
            <div className="w-full p-3 flex flex-col bg-[#191919] h-[14rem] rounded-md ">
                <div className="flex flex-col items-start">
                    <h1 className="text-gray-50 text-2xl">

                        {earnings === 0 ?
                            <>
                                < div className='flex items-center space-x-2'>
                                    0
                                    < Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={20} height={20} className="ml-1" />
                                </div>
                            </>
                            :
                            < div className='flex items-center space-x-2'>
                                {earnings.toFixed(4)}
                                < Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={20} height={20} className="ml-1" />
                            </div>
                        }
                    </h1>
                    <span className="text-slate-500 text-sm">
                        Accumulated Time: {data?.accumulatedTime || 0}s
                    </span>
                </div>

                <Separator className="my-4 bg-[#232323]" />

                <div className="m-auto">
                    <WithdrawRewards />
                </div>
            </div>
        </div>
    )
}
