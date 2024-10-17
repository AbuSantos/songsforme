import { client } from "@/lib/client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { deleteSession, setsession } from "@/actions/set-sessions";
import { CreateUsername } from "@/components/users/add-user";
import { getUserByAddress } from "@/data/user";
import { useState } from "react"; // Import useState to handle state

export const ConnecttButton = () => {
    const [isCreatingUser, setIsCreatingUser] = useState(false); // State to manage user creation flow
    const [connectedAddress, setConnectedAddress] = useState(null || String); // State to manage the connected address
    const [isOpen, setIsOpen] = useState<boolean>(true)

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
                        console.log(user)
                        if (user) {
                            // User exists, set session
                            await setsession(account.address);
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
