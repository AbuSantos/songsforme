"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
    placeholder: string;
    classname?: string;
};

export const Search = ({ placeholder, classname }: SearchProps): JSX.Element => {
    const searchParams = useSearchParams()

    console.log(searchParams)
    
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams)
        //@ts-ignore
        // params.set("page", 1)

        if (e.target.value) {
            e.target.value.length > 2 &&
                params.set("q", e.target.value)
        } else {
            params.delete("q")
        }

        replace(`${pathname}?${params}`)

    }, 300)

    return (
        <Input
            placeholder={placeholder}
            className={`${classname} border-[1px] py-6 px-2 border-[#19191B] w-full`}
            // value={inputValue}
            onChange={handleSearch}
        />
    );
};
