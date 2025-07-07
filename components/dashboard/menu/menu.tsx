"use client"
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { AddMusicModal } from "../../modal/add-music"
import { useEffect, useState } from "react"
import { ConnecttButton } from "@/web3/connect-button"
import { AddToWhitelist } from "../../modal/add-to-whitelist"
import { ListNFTForm } from "../../modal/list-nft"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"
import NotificationFeed from "@/components/knock/notification-feed"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { isConnected } from "@/atoms/session-atom"
import { ConnectMenu } from "@/web3/connect-with-wagmi"
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/lib/client";

export function Menu() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const userId = useRecoilValue(isConnected)?.userId;
    const userEmail = useRecoilValue(isConnected)?.userEmail
    const adminId = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()!

    useEffect(() => {
        const getUserEmails = async () => {
            if (userId) {
                const email = await getUserEmail({ client });
                if (email) {
                    console.log("User email:", email);
                } else {
                    console.log("No email found for user.");
                }
            }
        }
        getUserEmails();
    }, [userId])


    return (
        <div className="md:fixed justify-between items-center p-2 hidden md:flex w-[95%] bg-transparent z-50">
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
                    <AddToWhitelist adminId={adminId} userId={userId} email={userEmail || ""} />
                }
                {/* <ConnectMenu /> */}
                <ConnecttButton />
            </div>

            {
                isOpen &&
                <AddMusicModal setIsOpen={setIsOpen} />
            }
        </div>
    )
}