"use client"
import { Input } from "@/components/ui/input"
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ChangeEvent } from "react"
import { useDebouncedCallback } from "use-debounce"

type SearchProps = {
    /** Placeholder text for the input field */
    placeholder: string;
    /** Additional CSS classes for styling the input */
    classname?: string;
}

/**
 * Search component to handle search functionality with debouncing.
 * Uses Next.js router and URLSearchParams to update the URL based on input.
 *
 * @param {SearchProps} props - The properties for the Search component.
 * @returns {JSX.Element} - The Search input component.
 */
export const Search = ({ placeholder, classname }: SearchProps): JSX.Element => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Debounced search handler with a 300ms delay
    const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (e.target.value) {
            // Set 'filter' parameter if input length is greater than 2
            if (e.target.value.length > 2) {
                params.set("filter", e.target.value);
            }
        } else {
            params.delete("filter");
        }

        // Replace current URL with updated search parameters
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <Input
            placeholder={placeholder}
            className={`${classname} border-[1px] p-4 border-[#19191B] w-full`}
            onChange={handleSearch}
        />
    );
}
