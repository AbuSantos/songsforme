"use client";

import React, { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export const Minter = () => {
    const [nftDetails, setNftDetails] = useState({
        name: "",
        symbol: "",
        description: "",
        image: "",
        song: "",
        royalty: "",
        royaltyRate: "",
    });
    const [localImage, setLocalImage] = useState("")

    const [uploading, setUploading] = useState(false);

    // Handle non-file inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNftDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Mock IPFS upload function
    const uploadToIPFS = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`ipfs://mocked-ipfs-url/${file.name}`);
            }, 1000);
        });
    };

    const handleCameraClick = () => {
        const inputElement = document.getElementById("image")
        inputElement?.click()
    }

    // Handle image upload
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        setUploading(true);

        try {
            // Local preview logic
            const reader = new FileReader();
            reader.onload = async (e) => {
                const previewUrl = e.target?.result; // Base64 string for preview
                console.log("Preview URL:", previewUrl);

                // Upload to IPFS
                const ipfsUrl = await uploadToIPFS(file);
                setNftDetails((prev) => ({
                    ...prev,
                    image: ipfsUrl,
                }));
                setLocalImage(file)
                console.log("Uploaded to IPFS:", ipfsUrl);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handle song upload
    const handleSongUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        setUploading(true);
        try {
            const ipfsUrl = await uploadToIPFS(file);
            setNftDetails((prev) => ({
                ...prev,
                song: ipfsUrl,
            }));
            console.log("Song uploaded to IPFS:", ipfsUrl);
        } catch (error) {
            console.error("Song upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Validate form inputs
    const validateForm = () => {
        const { name, symbol, image, song, royalty, royaltyRate } = nftDetails;
        return name && symbol && image && song && royalty && royaltyRate;
    };

    // Handle NFT minting
    const handleMint = async () => {
        if (!validateForm()) {
            alert("Please complete all fields before minting.");
            return;
        }

        try {
            console.log("Minting NFT with details:", nftDetails);
            // Replace this with actual minting logic (e.g., blockchain interaction)
        } catch (error) {
            console.error("Minting failed:", error);
        }
    };

    return (
        <div className="">
            {/* NFT Metadata Section */}
            <section>
                <header className="text-lg font-semibold mb-4">NFT Metadata</header>
                <div className="grid grid-cols-2 gap-4">

                    <div className="image flex flex-col items-center justify-center space-y-3 bg-black cursor-pointer border-1 border-dashed border-[#606060] rounded-md"
                        onClick={() => handleCameraClick()}
                    >
                        <Input
                            type="file"
                            id="image"
                            onChange={handleImageUpload}
                            className="py-3 hidden border-[0.7px] border-gray-700 outline-none h-12 cursor-pointer text-gray-100"
                        />

                        {nftDetails.image ? (
                            <Image
                                src={localImage}
                                // src={nftDetails.image}
                                alt="Uploaded Preview"
                                className="mt-2 w-32 h-32 object-cover"
                                width={100} height={330}
                            />
                        ) :
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <span className="rounded-full border-[1px] border-[#606060] p-3 ">
                                    <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </span>
                                <span>Upload image</span>
                            </div>

                        }
                    </div>

                    {/* Metadata Inputs */}
                    <div className="details">
                        <div className="mb-4">
                            <Label htmlFor="name">Song Name</Label>
                            <Input
                                value={nftDetails.name}
                                onChange={handleChange}
                                id="name"
                                placeholder="Song Name"
                                className="py-5 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                            />
                        </div>

                        {/* Symbol Input */}
                        <div className="mb-4">
                            <Label htmlFor="symbol">Symbol</Label>
                            <Input
                                value={nftDetails.symbol}
                                onChange={handleChange}
                                id="symbol"
                                placeholder="Symbol"
                                className="py-5 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                            />
                        </div>

                        {/* Song Upload */}
                        <div className="mb-4">
                            <Label htmlFor="song">Upload Song</Label>
                            <Input
                                type="file"
                                id="song"
                                onChange={handleSongUpload}
                                className="py-5 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                            />
                            {nftDetails.song && (
                                <audio controls className="mt-2">
                                    <source src={nftDetails.song} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>

                        {/* Description Input */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={nftDetails.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="py-5 border-[0.7px] border-gray-700 outline-none h-24 text-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Primary Sales Section */}
            <section className="mt-6">
                <header className="text-lg font-semibold mb-4">Primary Sales</header>

                <div className="mb-4">
                    <Label htmlFor="royalty">Royalty Address</Label>
                    <Input
                        id="royalty"
                        value={nftDetails.royalty}
                        onChange={handleChange}
                        placeholder="Wallet Address"
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                    <Label htmlFor="royalty" className="text-[#606060] text-sm"> The wallet address that should receive the revenue from secondary sales of the assets.
                    </Label>
                </div>

                {/* Royalty Percentage */}
                <div className="mb-4">
                    <Label htmlFor="royaltyRate">Royalty %</Label>
                    <Input
                        id="royaltyRate"
                        value={nftDetails.royaltyRate}
                        onChange={handleChange}
                        placeholder="Royalty Percentage"
                        type="number"
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                    <Label htmlFor="royaltyRate" className="text-[#606060] text-sm"> The Percentage of royalty on all secondary sales of the assets.
                    </Label>
                </div>
            </section>

            <button
                onClick={handleMint}
                disabled={!validateForm()}
                className={`py-3 px-6 mt-4 text-white rounded-md ${validateForm() ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                {uploading ? "Uploading..." : "Mint NFT"}
            </button>
        </div>
    );
};
