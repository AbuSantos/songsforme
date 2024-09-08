import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

export const ConnecttButton = () => {
    const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID! });
    return (
        < ConnectButton
            client={client}
            auth={{
                getLoginPayload: async (params) => {
                    const address = params.address;
                    console.log(address)
                },

            }}

        />
    )
}

