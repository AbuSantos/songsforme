"use client"

import { Toggle } from "@/components/ui/toggle"
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const FilterByTime = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [activeFilter, setActiveFilter] = useState(searchParams.get("filter") || undefined);

    const handleValue = (newFilter: string) => {
        const params = new URLSearchParams(searchParams);
        if (newFilter === activeFilter) {
            params.delete("filter");
            setActiveFilter("");
        } else {
            params.set("filter", newFilter);
            setActiveFilter(newFilter);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex p-2 space-x-1 w-full">
            <Toggle
                pressed={activeFilter === "6min"}
                aria-label="10m hours filter"
                className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]"
                variant="default"
                onClick={() => handleValue("6min")}
            >
                10m
            </Toggle>
            <Toggle
                pressed={activeFilter === "1hr"}
                aria-label="1 hours filter"
                className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]"
                onClick={() => handleValue("1hr")}
            >
                1h
            </Toggle>
            <Toggle
                pressed={activeFilter === "6hr"}
                aria-label="6 hours filter"
                className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]"
                onClick={() => handleValue("6hr")}
            >
                6h
            </Toggle>
            <Toggle
                pressed={activeFilter === "24hr"}
                aria-label="24 hours filter"
                className="bg-[#2A2A2A] hover:bg-[#2A2A2A] w-[40px]"
                onClick={() => handleValue("24hr")}
            >
                24h
            </Toggle>
        </div>
    )
}