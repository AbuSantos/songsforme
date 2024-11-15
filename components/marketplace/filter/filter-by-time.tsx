"use client"
import { Toggle } from "@/components/ui/toggle"
import { useRouter } from "next/navigation";
import { useState } from "react";

export const FilterByTime = () => {
    const router = useRouter();
    const [filter, setFilter] = useState("");

    const handleValue = (newFilter: string) =>
        setFilter(newFilter); {
        const params = new URLSearchParams(window.location.search)
        params.set("filter", filter)
        router.push(`?${params.toString()}`);
    }
    return (
        <div className="flex  p-2 space-x-1">
            <Toggle aria-label="10m hours filter" className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]" variant="default" onClick={() => handleValue("6min")}>
                10m
            </Toggle>
            <Toggle aria-label="1 hours filter" className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]" onClick={() => handleValue("1hr")}>
                1h
            </Toggle>
            <Toggle aria-label="6 hours filter" className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]" onClick={() => handleValue("6hr")}>
                6h
            </Toggle>
            <Toggle aria-label="24 hours filter" className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]" onClick={() => handleValue("24hr")}>
                24h
            </Toggle>
        </div>

    )
}


