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
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { createSingleWithNFTs } from "@/actions/create-list";
import { toast } from "sonner";
import { classifyMood } from "@/lib/classify-moods";
// import { zoraIntegration, ZoraMintingConfig, ZoraMintingResult } from "@/lib/zora-integration";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

type NftState = {
    name: string;
    symbol: string;
    description: string;
    image: string;
    animation_url: string;
    attributes: { trait_type: string; value: string }[];
    royalty: string;
    royaltyRate: string;
    price: string,
    mood: string,
    tempo: GLfloat,
    chroma: GLfloat,
    spectralCentroid: GLfloat
};

export const ZoraMinter = () => {
    const userId = useRecoilValue(isConnected)?.userId;
    const userEmail = useRecoilValue(isConnected)?.userEmail;
    const username = useRecoilValue(isConnected)?.username;
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

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
    const [tokenUri, setTokenUri] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [mintingResult, setMintingResult] = useState(null);
    const [isPending, startTransition] = useTransition();

    const storage = new ThirdwebStorage({
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
        secretKey: process.env.THIRDWEB_NEW_API || "",
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
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }

        setUploading(true);
        try {
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
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Handle song upload
    const handleSongUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("No file selected!");
            return;
        }

        if (!file.type.startsWith("audio/")) {
            toast.error("Please upload a valid audio file.");
            return;
        }

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

            const mood = classifyMood(analyzeResponse);

            setNftDetails((prev: any) => ({
                ...prev,
                mood: mood,
                chroma: analyzeResponse.chroma,
                tempo: analyzeResponse.tempo,
                spectralCentroid: analyzeResponse.spectralCentroid,
                animation_url: ipfsUrl,
            }));

        } catch (error: any) {
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

        if (!attributes.some(attr => attr.trait_type === 'Genre')) {
            toast.error('Please select a genre');
            return false;
        }

        return true;
    };

    // Handle Zora minting (NFT + Coin)
    const handleZoraMint = async () => {
        if (!validateForm()) {
            return;
        }

        if (!address) {
            toast.error("Please connect your wallet first");
            return;
        }

        setIsMinting(true);
        try {
            // Upload metadata to IPFS
            //@ts-ignore
            const metadata = zoraIntegration.formatMetadataForZora(nftDetails);
            const tokenUri = await storage.upload(metadata);
            setTokenUri(tokenUri);

            // Prepare config for Zora
            const zoraConfig = {
                ...nftDetails,
                animation_url: tokenUri // Use the metadata URI instead of direct audio URL
            };

            // Mint NFT and Coin on Zora
            //@ts-ignore
            const result = await zoraIntegration.mintNFTWithCoin(zoraConfig, address, publicClient, walletClient);

            if (result.success) {
                setMintingResult(result);
                toast.success("NFT and Coin minted successfully on Zora!");

                // Save to database
                await handleSaveToDatabase(result);
            } else {
                toast.error(`Minting failed: ${result.error}`);
            }

        } catch (error) {
            console.error("Zora minting failed:", error);
            toast.error("Minting failed. Please try again.");
        } finally {
            setIsMinting(false);
        }
    };

    const handleSaveToDatabase = async (zoraResult: any) => {
        startTransition(async () => {
            const res = await createSingleWithNFTs(
                (userId || ""),
                (username || ""),
                nftDetails.name,
                (userId || ""),
                nftDetails.image,
                "0",
                nftDetails.price,
                zoraResult.nftContractAddress, // Use Zora NFT contract address
                tokenUri,
                nftDetails.mood,
                nftDetails.attributes.find(attr => attr.trait_type === "Genre")?.value || "",
                userEmail
            );

            //@ts-ignore
            if (res.status === "success") {
                toast.success("NFT and Coin saved to database successfully!");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Mint Your Music NFT + Coin</h1>
                <p className="text-gray-600">Create your music NFT and get a corresponding coin on Zora</p>
            </div>

            {/* NFT Metadata Section */}
            <section className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Music Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name">Song Name *</Label>
                        <Input
                            id="name"
                            value={nftDetails.name}
                            onChange={handleChange}
                            placeholder="Enter song name"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="symbol">Symbol *</Label>
                        <Input
                            id="symbol"
                            value={nftDetails.symbol}
                            onChange={handleChange}
                            placeholder="e.g., SONG"
                            className="mt-1"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={nftDetails.description}
                            onChange={handleChange}
                            placeholder="Describe your song..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="price">Price (ETH) *</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.001"
                            value={nftDetails.price}
                            onChange={handleChange}
                            placeholder="0.01"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="royaltyRate">Royalty Rate (%) *</Label>
                        <Input
                            id="royaltyRate"
                            type="number"
                            step="0.1"
                            value={nftDetails.royaltyRate}
                            onChange={handleChange}
                            placeholder="5.0"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="royalty">Royalty Address *</Label>
                        <Input
                            id="royalty"
                            value={nftDetails.royalty}
                            onChange={handleChange}
                            placeholder="0x..."
                            className="mt-1"
                        />
                    </div>

                    <div>
                {/* @ts-ignore */}

                        <SelectGenre onGenreChange={handleAttributeChange} />
                    </div>
                </div>
            </section>

            {/* File Upload Section */}
            <section className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="image">Cover Image *</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-1"
                            disabled={uploading}
                        />
                        {localImage && (
                            <div className="mt-2">
                                <Image
                                    src={localImage}
                                    alt="Preview"
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="audio">Audio File *</Label>
                        <Input
                            id="audio"
                            type="file"
                            accept="audio/*"
                            onChange={handleSongUpload}
                            className="mt-1"
                            disabled={uploading}
                        />
                        {nftDetails.animation_url && (
                            <p className="mt-2 text-sm text-green-600">
                                ✅ Audio uploaded successfully
                            </p>
                        )}
                    </div>
                </div>

                {uploading && (
                    <div className="mt-4 text-center">
                        <p className="text-blue-600">Uploading...</p>
                    </div>
                )}
            </section>

            {/* Minting Section */}
            <section className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Mint on Zora</h2>

                <div className="text-center">
                    <button
                        onClick={handleZoraMint}
                        disabled={isMinting || !address}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                    >
                        {isMinting ? "Minting..." : "Mint NFT + Coin on Zora"}
                    </button>

                    {!address && (
                        <p className="mt-2 text-red-600 text-sm">
                            Please connect your wallet to mint
                        </p>
                    )}
                </div>
                {/* @ts-ignore */}
                {mintingResult && mintingResult.success && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">✅ Minting Successful!</h3>
                        <div className="space-y-2 text-sm">
                {/* @ts-ignore */}
                            <p><strong>NFT Contract:</strong> {mintingResult.nftContractAddress}</p>
                {/* @ts-ignore */}
                           
                            <p><strong>Coin Contract:</strong> {mintingResult.coinContractAddress}</p>
                {/* @ts-ignore */}
                          
                            <p><strong>Token ID:</strong> {mintingResult.tokenId}</p>
                        </div>
                    </div>
                )}
                {/* @ts-ignore */}

                {mintingResult && !mintingResult.success && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">❌ Minting Failed</h3>
                {/* @ts-ignore */}
                       
                        <p className="text-red-600">{mintingResult.error}</p>
                    </div>
                )}
            </section>
        </div>
    );
}; 