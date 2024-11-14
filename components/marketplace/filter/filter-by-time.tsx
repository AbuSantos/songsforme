import { Bold } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export const FilterByTime = () => {
    return (
        <div className="flex  p-2 space-x-2">
            <Toggle aria-label="Toggle bold " className="bg-[#2A2A2A] hover:bg-[#2A2A2A]" variant="default" >
                10m
            </Toggle>
            <Toggle aria-label="Toggle bold" className="bg-[#2A2A2A] hover:bg-[#2A2A2A]">
                1h
            </Toggle>
            <Toggle aria-label="Toggle bold" className="bg-[#2A2A2A] hover:bg-[#2A2A2A]">
                6h
            </Toggle>
            <Toggle aria-label="Toggle bold" className="bg-[#2A2A2A] hover:bg-[#2A2A2A]">
                24h
            </Toggle>
        </div>

    )
}


