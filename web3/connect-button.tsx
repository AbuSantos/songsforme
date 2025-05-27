import { client } from "@/lib/client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet, privateKeyToAccount } from "thirdweb/wallets";
import { deleteSession, setsession } from "@/actions/set-sessions";
import { CreateUsername } from "@/components/users/add-user";
import { getUserByAddress } from "@/data/user";
import { useState } from "react"; // Import useState to handle state
import { createAuth } from "thirdweb/auth";
import { useSetRecoilState } from "recoil";
import { isConnected, UserSession } from "@/atoms/session-atom";
import { usePersistedRecoilState } from "@/hooks/usePersistedRecoilState";
import { toast } from "sonner";


import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

// const privateKey = process.env.METAMASK_PRIVATE_KEY!
// const thirdwebAuth = createAuth({
//     domain: "localhost:3000",
//     client,
//     adminAccount: privateKeyToAccount({ client, privateKey }),
// });

// FIX THE TYPES ERROR AND REMOVE TYPE-IGNORE

export const ConnecttButton = () => {
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<null | string>();
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const setIsConnected = useSetRecoilState(isConnected)
    const [sessionId, setSessionId] = usePersistedRecoilState(isConnected, 'session-id');

    const { address } = useAccount();
    console.log(address, "address in connect button component")

    const wallets = [
        inAppWallet({
            //@ts-ignore
            providers: [
                "passkey"
            ]
        }),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];
    return (
        <>
            <ConnectButton
                client={client}
                wallets={wallets}

                connectButton={{
                    label: "Sign In"
                }}
                connectModal={{
                    title: "Sign in to Bullchord",
                }}
                onConnect={async (wallet) => {
                    try {
                        const account = wallet.getAccount();

                        if (!account?.address) {
                            toast.error("Failed to retrieve wallet address");
                            return;
                        }

                        const normalizedAddress = account.address.toLowerCase();
                        const user = await getUserByAddress(normalizedAddress);
                        if (user) {
                            // User exists, set session
                            await setsession(normalizedAddress);
                            const session: UserSession = {
                                userId: normalizedAddress,
                                username: user?.username!,
                                userEmail: user?.email!,
                            }
                            setSessionId(session)

                        } else {
                            // User does not exist, trigger user creation flow
                            setConnectedAddress(normalizedAddress);
                            setIsCreatingUser(true); // Trigger the CreateUsername component
                        }


                    } catch (error) {
                        console.error("Error during wallet connection or session setup:", error);
                    }
                }}


                onDisconnect={async () => {
                    try {
                        await deleteSession();
                        setConnectedAddress(null); // Clear the connected address
                        setIsCreatingUser(false); // Reset the user creation flow
                        setSessionId(null);
                    } catch (error) {
                        console.error("Error during disconnection:", error);
                    }
                }}
            />

            {isCreatingUser && connectedAddress && isOpen && (
                <CreateUsername address={connectedAddress} setIsOpen={setIsOpen} isOpen={isOpen} />
            )}
        </>
    );
};
