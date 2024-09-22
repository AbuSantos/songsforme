import { client } from "@/lib/client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const ConnecttButton = () => {
    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];
    return (
        < ConnectButton
            client={client}
            wallets={wallets}
        />
    )
}

