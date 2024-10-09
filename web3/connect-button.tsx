import { client } from "@/lib/client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { setsession } from "@/actions/set-sessions"; // Your session management function

export const ConnecttButton = () => {
    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];

    return (
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

                    // Call the session management function with the wallet address
                    await setsession(account.address);
                } catch (error) {
                    console.error("Error during wallet connection or session setup:", error);
                }
            }}
        />
    );
};
