import { client } from "@/lib/client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
export const ConnecttButton = () => {
    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];

    
    // console.log(activeAccount?.address)
    return (
        < ConnectButton
            client={client}
            wallets={wallets}
        />
    )
}

