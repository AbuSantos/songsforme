import Image from 'next/image'

const PlayerDetails = () => {
    return (
        <div className='flex space-x-2 justify-center items-center cursor-pointer'>
            <Image
                src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"
                alt="test" width={40} height={30} className="rounded-md" />
            <div className='flex-col flex'>
                <small> song Name</small>
                <small>Artiste Name</small>
            </div>
        </div>
    )
}

export default PlayerDetails