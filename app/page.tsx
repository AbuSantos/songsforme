import { Header } from "@/components/homepage/banner";
import { Carousel } from "@/components/homepage/homepage-carousel";
import { MiddlePage } from "@/components/homepage/middle-page";
import { SongCount } from "@/components/homepage/song-count";
import Image from "next/image";


export default async function HomePage() {

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center relative overflow-y-hidden">
      <div className="flex items-center justify-center align-middle p-4 m-auto text-center">
        <Header />
      </div>
      <div className="text-gray-100 flex items-center justify-center align-middle py-6 m-auto">
        <MiddlePage />
      </div>
      <div className="pt-36 flex align-middle justify-center items-center m-auto text-white">
        <SongCount />
      </div>
      <footer className="w-screen">
        <Carousel />
      </footer>
    </div>
  )
}