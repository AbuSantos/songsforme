import { Header } from "@/components/homepage/banner";
import { MiddlePage } from "@/components/homepage/middle-page";
import { SongCount } from "@/components/homepage/song-count";


export default async function HomePage() {

  return (
    <div className="h-screen max-h-screen text-gray-100">
      <div className=" flex items-center justify-center align-middle p-4 m-auto">
        <Header />
      </div>
      <div className="text-gray-100 flex items-center justify-center align-middle py-8 m-auto">
        <MiddlePage />
      </div>
      <div className="pt-72 flex align-middle justify-center items-center m-auto">
        <SongCount />
      </div>
    </div>
  )
}