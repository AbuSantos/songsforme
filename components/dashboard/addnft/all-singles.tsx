"use client"
import { CreateSingle } from "./create-single"

export const AllMySingle = () => {
    return (
        <div>
            <header className="flex items-center justify-between">
                <p>
                    All Singles
                </p>
                <CreateSingle />
            </header>
        </div>
    )
}
