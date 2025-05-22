"use client"
import { Header } from "@/components/homepage/banner";
import { Carousel } from "@/components/homepage/homepage-carousel";
import { MiddlePage } from "@/components/homepage/middle-page";
import { SongCount } from "@/components/homepage/song-count";
import { registerServiceWorker } from "@/lib/service/service-worker-registrar";
import Image from "next/image";
import { useEffect } from "react";

export default function HomePage() {

  useEffect(() => {
    registerServiceWorker();
  }, []);

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
      {/* <div className="relative z-40 pt-6 flex align-middle justify-center items-center m-auto text-white">
        <SongCount />
      </div> */}
      {/* <footer className="relative z-10 w-screen">
        <Carousel />
      </footer> */}
    </div>
  )
}