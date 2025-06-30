"use client";

import React, { ChangeEvent, useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SelectGenre } from "./select-genre";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { nftContract, nftFactoryContract, nftMintingABI } from "@/lib/client"
import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";
import { useContract } from "@thirdweb-dev/react";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { createSingleWithNFTs } from "@/actions/create-list";
import { toast } from "sonner";
import { classifyMood } from "@/lib/classify-moods";

type NftState = {
    name: string;
    symbol: string;
    description: string;
    image: string;
    animation_url: string;
    attributes: { trait_type: string; value: string }[]; // Update this type
    royalty: string;
    royaltyRate: string;
    price: string,
    mood: string,
    tempo: GLfloat,
    chroma: GLfloat,
    spectralCentroid: GLfloat
};

export const Minter = () => {
    const userId = useRecoilValue(isConnected)?.userId;
    const userEmail = useRecoilValue(isConnected)?.userEmail;
    const username = useRecoilValue(isConnected)?.username

    const [nftDetails, setNftDetails] = useState<NftState>({
        name: "",
        symbol: "",
        description: "",
        image: "",
        animation_url: "",
        attributes: [],
        price: "",
        royalty: "",
        royaltyRate: "",
        mood: "",
        tempo: 0,
        chroma: 0,
        spectralCentroid: 0

    });
    const [localImage, setLocalImage] = useState("");
    const [tokenUri, setTokenUri] = useState("")
    const [uploading, setUploading] = useState(false);
    const [deployed, setIsDeployed] = useState(false)
    const [isPreparedMint, setIsPreparedMint] = useState(false)
    const [deployedAddress, setIsDeployedAddress] = useState<string>("")
    const [isPending, startTransition] = useTransition();

    const storage = new ThirdwebStorage({
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
        secretKey: process.env.THIRDWEB_NEW_API!,
    });

    // Update NFT details for non-file inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNftDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Upload a file to IPFS using ThirdwebStorage
    const uploadToIPFS = async (file: File): Promise<string> => {
        try {
            const uri = await storage.upload(file);
            const gatewayUrl = storage.resolveScheme(uri);

            return gatewayUrl;
        } catch (error) {
            console.error("Failed to upload to IPFS:", error);
            throw error;
        }
    };

    // Handle image file selection and upload
    const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload image to IPFS
            const ipfsUrl = await uploadToIPFS(file);
            setNftDetails((prev) => ({
                ...prev,
                image: ipfsUrl,
            }));

            // Set a local preview for the image
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) setLocalImage(e.target.result as string);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handle song upload
    const handleSongUpload = async (event: ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) {
            console.error("No file selected!");
            return;
        }

        // Validate that the file is an audio file
        if (!file.type.startsWith("audio/")) {
            console.error("File is not an audio file!");
            toast.error("Please upload a valid audio file.");
            return;
        }

        console.log("Uploading file:", file);
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {

            // Run the analyze API call and the IPFS upload in parallel
            const [analyzeResponse, ipfsUrl] = await Promise.all([
                fetch("/api/analyze-audio", {
                    method: "POST",
                    body: formData,
                }).then(async (res) => {
                    if (!res.ok) {
                        throw new Error(`Upload failed: ${res.statusText}`);
                    }
                    return res.json();
                }),
                uploadToIPFS(file),
            ]);

            console.log("Extracted Features:", analyzeResponse);
            const mood = classifyMood(analyzeResponse);

            console.log("Mood:", mood);

            // Update NFT details state with the new metadata and IPFS URL
            setNftDetails((prev: any) => ({
                ...prev,
                mood: mood,
                chroma: analyzeResponse.chroma,
                tempo: analyzeResponse.tempo,
                spectralCentroid: analyzeResponse.spectralCentroid,
                animation_url: ipfsUrl,
            }));
        } catch (error: any) {
            console.error("Song upload failed:", error);
            toast.error(error.message || "Song upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Update genre attribute
    const handleAttributeChange = (value: string) => {
        setNftDetails((prev) => ({
            ...prev,
            attributes: [
                ...prev.attributes.filter((attr) => attr.trait_type !== "Genre"),
                { trait_type: "Genre", value },
            ],
        }));
    };

    // Validate form completion
    const validateForm = () => {
        const {
            name,
            symbol,
            description,
            image,
            animation_url,
            royalty,
            royaltyRate,
            price,
            attributes
        } = nftDetails;

        // // Log values for debugging
        // console.log({
        //     name,
        //     symbol,
        //     description,
        //     image,
        //     animation_url,
        //     royalty,
        //     royaltyRate,
        //     price,
        //     attributes
        // });

        // Check if any required field is empty or undefined
        if (!name || !symbol || !image || !animation_url || !royalty || !royaltyRate || !price) {
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!symbol) missingFields.push('symbol');
            if (!image) missingFields.push('cover image');
            if (!animation_url) missingFields.push('song file');
            if (!royalty) missingFields.push('royalty address');
            if (!royaltyRate) missingFields.push('royalty rate');
            if (!price) missingFields.push('price');

            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return false;
        }

        // Check if attributes array has genre
        if (!attributes.some(attr => attr.trait_type === 'Genre')) {
            toast.error('Please select a genre');
            return false;
        }

        return true;
    };

    // Trigger the NFT minting process
    const handleMint = async () => {
        console.log("Minting NFT with details:", nftDetails);
        if (!validateForm()) {
            alert("Please complete all fields before minting.");
            return;
        }
        try {
            const tokenUri = await storage.upload(nftDetails);
            if (tokenUri) {
                setTokenUri(tokenUri)
                setIsDeployed(true)
            }
            setIsPreparedMint(true)
            console.log("Minting NFT with details:", tokenUri);
        } catch (error) {
            console.error("Minting failed:", error);
        }
    };

    const handleDeployedMint = async () => {
        const mintContract = await nftContract(deployedAddress)
        const tx = prepareContractCall({
            contract: mintContract,
            method: "mintNFT",
        })
        return tx
    }

    const handleSaveToDatabase = async () => {
        startTransition(async () => {
            const res = await createSingleWithNFTs(
                (userId || ""),
                (username || ""),
                nftDetails.name,
                (userId || ""),
                nftDetails.image,
                "0",
                nftDetails.price,
                deployedAddress,
                tokenUri,
                nftDetails.mood,
                nftDetails.attributes.find(attr => attr.trait_type === "Genre")?.value || "",
                userEmail
            )

            //@ts-ignore
            if (res.status === "success") {
                toast.success("NFT MINTED successfull")
            }
            console.log(res)
        })
    }

    return (
        <div >
            {/* NFT Metadata Section */}
            <section>
                <div className="block md:hidden">
                    <h2>Please use a desktop when minting for optimal UX</h2>
                </div>
                <div className="flex flex-col md:flex-row md:w-full space-x-2 ">
                    {/* Image Upload Section */}
                    <div
                        className="image flex flex-col items-center justify-center space-y-3 bg-black cursor-pointer border-1 border-dashed border-gray-700 rounded-md md:w-4/12 w-10/12"
                        onClick={() => document.getElementById("image")?.click()}
                    >
                        <Input
                            type="file"
                            id="image"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        {localImage ? (
                            <Image
                                src={localImage}
                                alt="Uploaded Preview"
                                width={100}
                                height={100}
                                className="w-32 h-32 object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
                                <span className="rounded-full border-[1px] border-[#606060] p-3">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </span>
                                <span>Upload image</span>
                            </div>
                        )}
                    </div>

                    {/* Metadata Inputs */}
                    <div className="detail md:w-8/12 w-full">
                        <div className="mb-4 w-full">
                            <Label htmlFor="name">Song Name</Label>
                            <Input
                                value={nftDetails.name}
                                onChange={handleChange}
                                id="name"
                                placeholder="Song Name"
                                className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"
                            />
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2 items-center">
                            <div>
                                <Label htmlFor="symbol">Symbol</Label>
                                <Input
                                    value={nftDetails.symbol}
                                    onChange={handleChange}
                                    id="symbol"
                                    placeholder="Symbol"
                                    className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="genre">Select Song Genre</Label>
                                <SelectGenre handleAttributeChange={handleAttributeChange} id="genre" />
                            </div>
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    type="text"
                                    id="price"
                                    value={nftDetails.price}
                                    onChange={handleChange}
                                    placeholder="0.001"
                                    className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"

                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="song">Upload Song</Label>
                            <Input
                                type="file"
                                id="song"
                                onChange={handleSongUpload}
                                className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"

                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full h-[1px] bg-[#606060] my-8"></div>

            {/* Royalties Section */}
            <section className="royalties">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="royalty">Royalty recepient address</Label>
                        <Input
                            id="royalty"
                            value={nftDetails.royalty}
                            onChange={handleChange}
                            placeholder="0x123456789123456789"
                            className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"

                        />
                    </div>
                    <div>
                        <Label htmlFor="royaltyRate">Royalty Rate</Label>
                        <Input
                            id="royaltyRate"
                            value={nftDetails.royaltyRate}
                            onChange={handleChange}
                            placeholder="Rate (%)"
                            className="py-6 border-[0.7px] border-gray-700 outline-none text-gray-100"
                        />
                    </div>
                </div>
            </section>

            <div className="w-full h-[1px] bg-[#606060] my-8"></div>

            {/* Description Section */}
            <section>
                <div>
                    <Label htmlFor="description">Tell us something about the song</Label>
                    <Textarea
                        id="description"
                        value={nftDetails.description}
                        onChange={handleChange}
                        placeholder="Describe the song."
                        className="py-4 border-[0.7px] border-gray-700 outline-none text-gray-100 bg-black"

                    />
                </div>
            </section>

            {/* Confirm listing Now BUTTONS */}
            <div
                className="mt-4 w-full px-5 py-2 flex items-center justify-center"
            >
                {
                    isPreparedMint &&
                    <TransactionButton
                        transaction={() => {
                            const tx = prepareContractCall({
                                contract: nftFactoryContract,
                                //@ts-ignore
                                method:
                                    "function createNFTContract(string name, string symbol, address royaltyRecipient, uint96 royaltyPercentage, string baseURI) payable",
                                params: [
                                    nftDetails.name,
                                    nftDetails.symbol,
                                    nftDetails.royalty,
                                    nftDetails.royaltyRate,
                                    tokenUri,
                                ],
                                value: toWei("0.001"),
                            });
                            return tx
                        }}

                        onTransactionConfirmed={(tx) => {
                            if (tx.status === "success") {
                                setIsDeployedAddress(tx.logs[0].address)
                                setIsDeployed(true)
                                toast.success("NFT Contract Listed successfully")
                            }
                            console.log(tx, "transaction")
                        }}
                        onError={(error: any) =>
                            toast.error("Something went wrong", error.message)
                            // console.log(error)
                        }
                        className="mt-4 w-full px-5 py-3 bg-[#6E56FF] text-white rounded-md disabled:bg-gray-500"
                    >
                        Confirm Listing
                    </TransactionButton>
                }
            </div>

            {/* Mint Now */}
            <div
                className="mt-4 w-full px-5 py-2 flex items-center justify-center"
            >
                {
                    deployed &&
                    <TransactionButton
                        transaction={handleDeployedMint}
                        onTransactionConfirmed={async (tx) => {
                            if (tx.status === "success") {
                                handleSaveToDatabase()
                            }
                            console.log(tx, "transaction")
                        }}
                        onError={(error: any) =>
                            toast.error("Something went wrong", error.message)
                            // console.log(error)
                        }
                        className="w-full"
                    >
                        Mint now
                    </TransactionButton>
                }
            </div>

            {/* Prepare listing*/}
            <div className="">
                {
                    !deployed && !isPreparedMint &&
                    <button
                        disabled={uploading || !userId}
                        onClick={handleMint}
                        className="mt-4 w-full px-5 py-3 bg-[#6E56FF] text-white rounded-md disabled:bg-gray-500"
                    >
                        {uploading ? "Uploading..." : userId ? "Prepare mint" : "Please connect your wallet"}
                    </button>
                }
            </div>
        </div >
    );
};
