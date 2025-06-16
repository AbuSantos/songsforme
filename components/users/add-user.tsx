"use client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { createUser } from "@/actions/create-user";
import { Label } from "../ui/label";
import { FormError } from "../errorsandsuccess/form-error";
import { useDebouncedCallback } from "use-debounce";
import { checkUserName } from "@/actions/check-username";
import { FormSuccess } from "../errorsandsuccess/form-success";
import { usePersistedRecoilState } from "@/hooks/usePersistedRecoilState";
import { isConnected, UserSession } from "@/atoms/session-atom";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { client, contractABI, contractAddress, contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";

interface UserProps {
    address: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateUsername = ({ address, isOpen, setIsOpen }: UserProps) => {
    const [isPending, startTransition] = React.useTransition();
    const [username, setUsername] = useState<string>("");
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
    const [checking, setChecking] = useState<boolean>(false);
    const [sessionId, setSessionId] = usePersistedRecoilState(isConnected, 'session-id');

    const {
        data: hash,
        isPending: wagmiPending,
        error,
        writeContract
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
            confirmations: 1,
        })


    const validateData = () => {
        if (!emailAddress.trim()) {
            toast.error("Email address is required!");
            return false;
        }
        if (!username.trim()) {
            toast.error("Username is required!");
            return false;
        }
        return true;
    }

    // const registerUser = async () => {
    //     if (!validateData()) {
    //         return;
    //     }
    //     try {
    //         writeContract({
    //             address: contractAddress,
    //             abi: contractABI,
    //             functionName: "registerUser",
    //         })

    //     } catch (error) {
    //         console.error("Error registering user:", error);
    //         throw error;
    //     }
    // }


    const addUser = () => {
        if (!validateData()) {
            return;
        }
        startTransition(async () => {
            try {
                const res = await createUser(address, username, emailAddress);
                if (res.status === true) {
                    toast.success(res.message);
                    setUsername("");
                    setEmailAddress("");
                    setIsOpen(false);

                    const session: UserSession = {
                        userId: address,
                        username: username,
                        userEmail: emailAddress,
                    }
                    setSessionId(session)
                } else {
                    toast.error(res.message);
                }
            } catch (error: any) {
                console.error("Error:", error);
                toast.error("Something went wrong!");
            }
        });
    };

    // useEffect(() => {
    //     if (isConfirmed) {
    //         addUser();
    //     }
    // }, [isConfirmed]);

    const handleCheckUserName = useDebouncedCallback(async (value: string) => {
        if (!value.trim()) {
            setIsUsernameValid(null);
            return;
        }
        setChecking(true);
        try {
            const res = await checkUserName(value);
            if (res?.isTaken) {
                setIsUsernameValid(false);
            } else {
                setIsUsernameValid(true);
            }
        } catch (error) {
            console.error("Error checking username:", error);
            setIsUsernameValid(null);
        } finally {
            setChecking(false);
        }
    }, 500);


    const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setUsername(value);
        setIsUsernameValid(null);
        handleCheckUserName(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative bg-black rounded-md md:w-2/6 max-lg-[100px]:w3/6 w-[90%] py-8 px-6 border-[0.7px] border-gray-600">
                <div className="flex flex-col items-center justify-center py-2">
                    <p className="bg-gray-100 rounded-full size-12 flex items-center justify-center mt-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style={{ fill: "rgba(0, 0, 0, 1)", transform: " msFilter" }}
                        >
                            <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
                        </svg>
                    </p>
                    <h1 className="text-gray-100 text-lg font-medium text-center p-3">
                        Create a User Profile
                    </h1>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label htmlFor="username" className="text-gray-100">
                        Your username
                    </Label>
                    <Input
                        id="username"
                        value={username}
                        required
                        type="text"
                        onChange={handleUserNameChange}
                        placeholder="kingjulien"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                    {checking && <p className="text-gray-400 text-sm">Checking...</p>}
                    {isUsernameValid === true && <p className="text-[teal] text-sm ">Username available!</p>}
                    {isUsernameValid === false && <p className="text-[#611623] text-sm ">Username already taken!</p>}
                </div>

                <div className="flex flex-col space-y-3 mt-4">
                    <Label htmlFor="mail" className="text-gray-100">
                        Your email address
                    </Label>
                    <Input
                        id="mail"
                        value={emailAddress}
                        type="email"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="king@gmail.com"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <TransactionButton
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        border: '1px solid #2A2A2A',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                        borderRadius: '0.375rem',
                        minWidth: 'auto',
                        fontSize: '0.8rem',

                    }}
                    transaction={() => {
                        const tx = prepareContractCall({
                            contract,
                            //@ts-ignore
                            method: "function registerUser()",
                        });
                        return tx;
                    }}
                    
                    onTransactionConfirmed={async (receipt) => {
                        if (receipt.status === "success") {
                            try {
                                await addUser();
                            } catch (error) {
                                toast.error("Error adding user!");
                            }
                        }
                    }}

                    onError={(error) =>
                        toast.error(error.message)
                    }
                >
                    Create User
                </TransactionButton>

                {/* <Button
                    disabled={isPending}
                    onClick={registerUser}
                    size="nav"
                    className="mt-3 w-full bg-slate-50 text-gray-950 hover:bg-slate-400"
                >
                    {isPending ? "Creating..." : "Create user"}
                </Button> */}
            </div>
        </div >
    );
};
