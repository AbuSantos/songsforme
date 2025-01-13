"use client"
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { AddMusicModal } from "../../modal/add-music"
import { useState } from "react"
import { ConnecttButton } from "@/web3/connect-button"
import { AddToWhitelist } from "../../modal/add-to-whitelist"
import { ListNFTForm } from "../../modal/list-nft"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"
import NotificationFeed from "@/components/knock/notification-feed"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { isConnected } from "@/atoms/session-atom"


export function Menu() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [listModalOpen, setListModalOpen] = useState<boolean>(false)
    const userId = useRecoilValue(isConnected)?.userId;

    console.log(userId)

    const adminId = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()!

    return (
        <div className="md:fixed justify-between items-center p-3 hidden md:flex w-full bg-black">
            <Menubar className="rounded-none border-b border-none p-4 lg:px-4 bg-[var(--bg-root)] text-[var(--text)]">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-xl">
                        <Link href="/dashboard">
                            Bullchord Music
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>
            <div className="ml-auto flex mr-4 justify-end space-x-2">
                {
                    userId && userId === adminId &&
                    <AddToWhitelist adminId={adminId} userId={userId} />
                }

                <ConnecttButton />
            </div>

            {
                isOpen &&
                <AddMusicModal setIsOpen={setIsOpen} />
            }
        </div>
    )
}