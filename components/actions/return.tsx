"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"


export const Return = () => {
    const router = useRouter()
    return (
        <div className="p-3">
            <Button onClick={() => router.back()} className="bg-transparent hover:bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#EEEEEE", transform: "msFilter" }}><path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path></svg>
            </Button>
        </div>
    )
}
