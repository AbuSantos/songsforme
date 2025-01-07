"use client";

import { Input } from "@/components/ui/input";
import { isEthereumAddress, isValidEthereumAddress } from "@/lib/helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
    placeholder: string;
    classname?: string;
};

export const Search = ({ placeholder, classname }: SearchProps): JSX.Element => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchValue, setSearchValue] = useState(searchParams.get("query") ?? "");

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term && term.length > 2) {
            // Check if the term is an Ethereum address
            if (isValidEthereumAddress(term)) {
                params.set("query", term);
            } else {
                params.set("query", term);
            }
        } else {
            params.delete("query");
        }

        // Clean up empty filter
        if (params.get("filter") === "") {
            params.delete("filter");
        }

        const queryString = params.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;
        replace(url);
    }, 300);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        handleSearch(e.target.value);
    };

    return (
        <Input
            value={searchValue}
            placeholder={placeholder}
            className={`${classname} border-[1px] py-6 px-2 border-[#19191B] w-full`}
            onChange={onInputChange}
            aria-label="Search"
        />
    );
};
