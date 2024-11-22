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
import { isConnected } from "@/atoms/session-atom";
import { usePersistedRecoilState } from "@/hooks/usePersistedRecoilState";

const privateKey = process.env.METAMASK_PRIVATE_KEY || "b9342970bf5ec1044da071be47966ba7c07c56a4870b5cf3636f3ca7afeb95d7"
const thirdwebAuth = createAuth({
    domain: "https://bullchordv1.vercel.app",
    client,
    adminAccount: privateKeyToAccount({ client, privateKey }),
});

// FIX THE TYPES ERROR AND REMOVE TYPE-IGNORE

export const ConnecttButton = () => {
    const [isCreatingUser, setIsCreatingUser] = useState(false); // State to manage user creation flow
    //@ts-ignore
    const [connectedAddress, setConnectedAddress] = useState(null || String); // State to manage the connected address
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const setIsConnected = useSetRecoilState(isConnected)
    const [sessionId, setSessionId] = usePersistedRecoilState(isConnected, 'session-id');


    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];
    return (
        <>
            <ConnectButton
                client={client}
                wallets={wallets}
                onConnect={async (wallet) => {
                    try {
                        const account = wallet.getAccount();

                        if (!account?.address) {
                            console.error("Failed to retrieve wallet address");
                            return;
                        }

                        const user = await getUserByAddress(account?.address);
                        if (user) {
                            // User exists, set session
                            await setsession(account.address);
                            setSessionId(account.address)

                        } else {
                            // User does not exist, trigger user creation flow
                            setConnectedAddress(account.address);
                            setIsCreatingUser(true); // Trigger the CreateUsername component
                        }
                    } catch (error) {
                        console.error("Error during wallet connection or session setup:", error);
                    }
                }}
                onDisconnect={async () => {
                    try {
                        await deleteSession();
                        //@ts-ignore

                        setConnectedAddress(null); // Clear the connected address
                        setIsCreatingUser(false); // Reset the user creation flow
                        //@ts-ignore

                        setSessionId(null);
                    } catch (error) {
                        console.error("Error during disconnection:", error);
                    }
                }}
            />

            {/* Render the user creation component if needed */}
            {isCreatingUser && connectedAddress && isOpen && (
                <CreateUsername address={connectedAddress} setIsOpen={setIsOpen} isOpen={isOpen} />
            )}
        </>
    );
};
