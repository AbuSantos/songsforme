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
import { AddToWhitelist } from "../../modal/add-to-whitelist"
import { ListNFTForm } from "../../modal/list-nft"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"
import NotificationFeed from "@/components/knock/notification-feed"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { isConnected } from "@/atoms/session-atom"
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/lib/client";
import dynamic from "next/dynamic"
import Deploy1155 from "@/zora/create-token"

const ConnecttButton = dynamic(() => import("@/web3/connect-button").then((mod) => mod.ConnecttButton), {
    ssr: false,
});

export function Menu() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const userId = useRecoilValue(isConnected)?.userId;
    const userEmail = useRecoilValue(isConnected)?.userEmail;
    const [mounted, setMounted] = useState(false);

    const adminId = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase() ?? "";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const getUserEmails = async () => {
            if (userId) {
                const email = await getUserEmail({ client });
                console.log("User email:", email ?? "Not found");
            }
        };
        getUserEmails();
    }, [userId]);

    if (!mounted) return null; // ← avoid hydration mismatches

    return (
        <div className="md:fixed justify-between items-center p-2 hidden md:!flex w-[95%] bg-transparent z-50">
            <div className="rounded-none border-b border-none p-4 lg:px-4 bg-[var(--bg-root)] text-[var(--text)]">
                <div className="font-bold text-xl flex items-center space-x-2">
                    <Link href="/dashboard">Bullchord Music</Link>

                    <Deploy1155 />
                </div>
            </div>
            <div className="ml-auto flex mr-4 justify-end space-x-2">
                {userId === adminId && (
                    <AddToWhitelist adminId={adminId} userId={userId} email={userEmail || ""} />
                )}
                <ConnecttButton />
            </div>

            {isOpen && <AddMusicModal setIsOpen={setIsOpen} />}
        </div>
    );
}
