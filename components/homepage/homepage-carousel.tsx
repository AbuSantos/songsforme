import Image from 'next/image'

export const Carousel = () => {
    return (
        <div className="absolute bottom-24 flex flex-col items-center w-full">
            <div className="relative w-full  h-10">
                <div className="relative z-10 w-full">
                    <Image src="/images/bg.jpg" alt="Artwork 1" width={1200} height={400} className="rounded-2xl shadow-lg w-full object-cover" />
                </div>
                <div className="absolute top-12 left-0 w-full z-20">
                    <Image src="/images/bg-image.jpg" alt="Artwork 2" width={1200} height={400} className="rounded-2xl shadow-lg w-full object-cover" />
                </div>
            </div>
        </div>
    )
}
