"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { useRouter } from "next/navigation";

export const Ratio = () => {
    const [isPending, startTransition] = React.useTransition();
    const [minRatio, setMinRatio] = useState<number | null>(null);
    const [maxRatio, setMaxRatio] = useState<number | null>(null);

    const userId = useRecoilValue(isConnected);
    const router = useRouter();

    const handleValue = (min: number | null, max: number | null) => {
        const params = new URLSearchParams(window.location.search);

        if (min !== null && max !== null && min > max) {
            toast.error("Minimum ratio cannot be greater than maximum ratio");
            return;
        }

        const currentMin = params.get("minRatio");
        const currentMax = params.get("maxRatio");

        const newMin = min?.toString() || "";
        const newMax = max?.toString() || "";

        if (currentMin === newMin && currentMax === newMax) {
            console.log("Query parameters unchanged, skipping router.push");
            return;
        }

        if (min !== null) {
            params.set("minRatio", min.toString());
        } else {
            params.delete("minRatio");
        }

        if (max !== null) {
            params.set("maxRatio", max.toString());
        } else {
            params.delete("maxRatio");
        }

        router.push(`?${params.toString()}`);
    };



    const resetFilters = () => {
        setMinRatio(null);
        setMaxRatio(null);
        router.push(window.location.pathname);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>
                    ratio
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h1 className="text-gray-100 text-center p-3">Filter by Ratio</h1>
                <div className="flex space-x-2">
                    <Input
                        value={minRatio ?? ""}
                        onChange={(e) => setMinRatio(parseFloat(e.target.value) || null)}
                        placeholder="Min"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        type="number"
                        step="0.01"
                    />
                    <Input
                        value={maxRatio ?? ""}
                        onChange={(e) => setMaxRatio(parseFloat(e.target.value) || null)}
                        placeholder="Max"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        type="number"
                        step="0.01"
                    />
                </div>
                <Button
                    disabled={isPending}
                    onClick={() => handleValue(minRatio, maxRatio)}
                    size="nav"
                    className="mt-3 w-full bg-slate-50 text-gray-950"
                >
                    Select
                </Button>
                <Button
                    onClick={resetFilters}
                    size="nav"
                    variant="secondary"
                    className="mt-2 w-full"
                >
                    Reset
                </Button>
            </PopoverContent>
        </Popover>
    );
};
