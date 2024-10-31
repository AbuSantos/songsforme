"use client";

import { calculateDecayedPlaylistCount } from "@/actions/helper/calculate-playlist";
import { calculateDecayedUniqueListeners } from "@/actions/helper/calculate-uniquelisterner";
import { calculateDynamicPrice } from "@/dynamic-price/main";
import { ListedNFT } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LineChart from "./chart/line-chart";


type PriceDataType = {
  timestamp: string; // UNIX timestamp
  price: number; // Price of the NFT at that timestamp
};

export const TrackChart = ({ track }: { track: ListedNFT }) => {
  const [unikListeners, setUnikListeners] = useState(0);
  const [playlistListing, setPlaylistListing] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceData, setPriceData] = useState<PriceDataType[]>([]); // Initialize as empty array

  if (!track) {
    toast.error("Please connect your wallet!");
  }

  // Fetch unique listeners
  useEffect(() => {
    const fetchUniqueListeners = async () => {
      const listeners = await calculateDecayedUniqueListeners(track?.id);
      setUnikListeners(listeners);
    };
    fetchUniqueListeners();
  }, [track?.id]);

  // Fetch playlist listings
  useEffect(() => {
    const fetchPlaylistListings = async () => {
      const uniquePlaylist = await calculateDecayedPlaylistCount(track?.id);
      setPlaylistListing(uniquePlaylist);
    };
    fetchPlaylistListings();
  }, [track?.id]);

  // Calculate dynamic price
  useEffect(() => {
    const fetchDynamicPrice = async () => {
      const calculatedPrice = await calculateDynamicPrice(
        track?.price,
        track?.recentPlays,
        // playlistListing,
        unikListeners
      );
      setPrice(calculatedPrice);

      const now = new Date().toISOString();
      setPriceData((prevData) => {
        const today = now.slice(0, 10);
        const lastEntry = prevData[prevData.length - 1];

        // Only update today's entry, or add a new one
        if (lastEntry && lastEntry.timestamp.startsWith(today)) {
          return prevData.map((entry, index) =>
            index === prevData.length - 1 ? { ...entry, price: calculatedPrice } : entry
          );
        } else {
          return [...prevData, { timestamp: now, price: calculatedPrice }];
        }
      });
    };
    fetchDynamicPrice();
  }, [track?.id, playlistListing, unikListeners]);

  // Conditionally render LineChart only if priceData has entries
  return (
    <div className="w-11/12 md:w-full  p-2">
      {priceData.length > 0 ? (
        <LineChart priceData={priceData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};
