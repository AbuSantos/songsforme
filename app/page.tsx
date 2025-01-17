import { Header } from "@/components/homepage/banner";
import { MiddlePage } from "@/components/homepage/middle-page";
import { Accordion } from "@/components/ui/accordion";


export default async function HomePage() {

  return (
    <div >
      <div>
        <Header />
      </div>
      <div className="text-gray-100 flex items-center justify-center m-auto">
        <MiddlePage />
      </div>
    </div>
  )
}