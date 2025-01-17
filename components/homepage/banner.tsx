import React from 'react'

export const Header = () => {
    return (
        <header className='h-48 w-full bg-red-600'>
            <div className='flex flex-col justify-center items-center '  >
                <h1 className='font-semibold md:text-5xl text-xl'>Your Sound, Your Asset.</h1>
                <h3 className='font-normal text-xl'> Play. Trade. Earn.</h3>
            </div>
        </header>
    )
}
