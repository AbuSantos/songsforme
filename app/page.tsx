import { Header } from "@/components/homepage/banner";
import { Carousel } from "@/components/homepage/homepage-carousel";
import { MiddlePage } from "@/components/homepage/middle-page";
import { SongCount } from "@/components/homepage/song-count";
import Image from "next/image";

export default async function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center relative overflow-y-hidden">
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src="/images/under.png"
          layout="fill"
          alt="bg"
          priority
          placeholder="blur"
          blurDataURL="/images/under-blur.png"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="relative z-10 flex items-center justify-center align-middle p-4 m-auto text-center">
        <Header />
      </div>
      <div className="relative z-10 text-gray-100 flex items-center justify-center align-middle py-6 m-auto">
        <MiddlePage />
      </div>
      <div className="relative z-10 pt-36 flex align-middle justify-center items-center m-auto text-white">
        <SongCount />
      </div>
      <footer className="relative z-10 w-screen">
        <Carousel />
      </footer>
    </div>
  )
}