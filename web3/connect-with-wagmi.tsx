"use client"
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useConnect } from 'wagmi'
import { shortenAddress } from 'thirdweb/utils'
import { usePersistedRecoilState } from '@/hooks/usePersistedRecoilState'
import { getUserByAddress } from '@/data/user'
import { deleteSession, setsession } from "@/actions/set-sessions";
import { isNewConnected, UserSession } from '@/atoms/session-atom'
import { useEffect, useState } from 'react'
import { CreateUsername } from '@/components/users/add-user'

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletAdvancedAddressDetails,
    WalletAdvancedTokenHoldings,
    WalletAdvancedTransactionActions,
    WalletAdvancedWalletActions,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';

import {
    Address,
    Avatar,
    Name,
    Identity,
} from '@coinbase/onchainkit/identity';

import { color } from '@coinbase/onchainkit/theme';

export const ConnectMenu = () => {
    const { connectors, connect } = useConnect()

    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<null | string>();
    const [sessionId, setSessionId] = usePersistedRecoilState(isNewConnected, 'session-id');
    // const normalizedAddress = address?.toLowerCase();
    const [isOpen, setIsOpen] = useState<boolean>(true)
    // const user = await getUserByAddress(normalizedAddress || "");

    useEffect(() => {
        const checkUser = async () => {
            if (!address) return
            const normalizedAddress = address.toLowerCase();
            const user = await getUserByAddress(normalizedAddress)

            if (user) {
                await setsession(normalizedAddress)
                const session: UserSession = {
                    userId: normalizedAddress,
                    username: user.username!,
                    userEmail: user.email!,
                }
                setSessionId(session)
            } else {
                setConnectedAddress(normalizedAddress)
                setIsCreatingUser(true)
            }


        }
        checkUser()
    }, [address, setSessionId])
    return (
        <div>
            <Wallet>
                <ConnectWallet>
                    <Avatar className="h-6 w-6" />
                    <Name />
                </ConnectWallet>
                <WalletDropdown>
                    <WalletAdvancedWalletActions />
                    <WalletAdvancedAddressDetails />
                    <WalletAdvancedTransactionActions />
                    <WalletAdvancedTokenHoldings />
                </WalletDropdown>
            </Wallet>

            {/* {
                isConnected ?

                    <div className='flex items-center gap-2 bg-black rounded-lg w-4/6 p-4'>
                        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
                        <div>
                            {address && <div className='text-gray-100 text-sm'>{ensName ? `${ensName} ( ${shortenAddress(address, 5)}))` : shortenAddress(address, 5)}</div>}
                            <button onClick={async () => {
                                try {
                                    await deleteSession();
                                    setConnectedAddress(null); // Clear the connected address
                                    setIsCreatingUser(false); // Reset the user creation flow
                                    setSessionId(null);
                                    disconnect()
                                } catch (error) {
                                    console.error("Error during disconnection:", error);
                                }
                            }
                            }
                                className='text-gray-200 text-center capitalize font-medium text-[1rem]'>Disconnect</button>
                        </div >
                    </div >
                    :
                    <div className='flex items-center gap-2 bg-black rounded-lg w-4/6  md:w-5\6 p-2 justify-center cursor-pointer' >
                        <button onClick={() => connect({ connector: connectors[0] })} className='text-gray-200 text-center capitalize font-medium text-[1rem]' >
                            connect wallet
                        </button>
                    </div>
            }
            {isCreatingUser && connectedAddress && isOpen && (
                <CreateUsername address={connectedAddress} setIsOpen={setIsOpen} isOpen={isOpen} />
            )} */}
        </div >

    )
}