"use client"
import { Input } from "@/components/ui/input"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ChangeEvent } from "react"
import { useDebouncedCallback } from "use-debounce"

type SearchProps = {
    placeholder: string
    classname?: string
}
export const Search = ({ placeholder, classname }: SearchProps) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams)
        //@ts-ignore
        params.set("page", 1)

        if (e.target.value) {
            e.target.value.length > 2 &&
                params.set("filter", e.target.value)
        } else {
            params.delete("filter")
        }

        replace(`${pathname}?${params}`)

    }, 300)
    return (
        <Input placeholder={placeholder} className={`${classname} border-[1px] border-[#19191B]`} onChange={handleSearch} />

    )
}