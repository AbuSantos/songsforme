"use client";

import { calculateDecayedPlaylistCount } from "@/actions/helper/calculate-playlist";
import { calculateDecayedUniqueListeners } from "@/actions/helper/calculate-uniquelisterner";
import { calculateDynamicPrice } from "@/dynamic-price/main";
import { ListedNFT } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LineChart from "./chart/line-chart";

type PriceDataType = {
  timestamp: number; // UNIX timestamp in seconds
  price: number; // Price of the NFT at that timestamp
}[];

export const TrackChart = ({ track }: { track: ListedNFT }) => {
  const [unikListeners, setUnikListeners] = useState(0);
  const [playlistListing, setPlaylistListing] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceData, setPriceData] = useState<PriceDataType>([]);

  if (!track) {
    toast.error("Please connect your wallet!");
  }

  useEffect(() => {
    const fetchUniqueListeners = async () => {
      const listeners = await calculateDecayedUniqueListeners(track?.id);
      setUnikListeners(listeners);
    };
    fetchUniqueListeners();
  }, [track?.id]);

  useEffect(() => {
    const fetchPlaylistListings = async () => {
      const uniquePlaylist = await calculateDecayedPlaylistCount(track?.id);
      setPlaylistListing(uniquePlaylist);
    };
    fetchPlaylistListings();
  }, [track?.id]);

  useEffect(() => {
    const fetchDynamicPrice = async () => {
      const calculatedPrice = await calculateDynamicPrice(
        track?.price,
        track?.recentPlays,
        // playlistListing,
        unikListeners
      );
      setPrice(calculatedPrice);
    };
    fetchDynamicPrice();
  }, [track?.id, playlistListing, unikListeners]);

  useEffect(() => {
    if (price > 0) {
      const currentTime = Math.floor(Date.now() / 1000); // UNIX timestamp in seconds
      const today = new Date().toISOString().slice(0, 10);

      setPriceData((prevData) => {
        const lastEntry = prevData[prevData.length - 1];
        
        // Check if today's data is already stored
        if (lastEntry && new Date(lastEntry.timestamp * 1000).toISOString().startsWith(today)) {
          return prevData.map((entry, index) =>
            index === prevData.length - 1 ? { ...entry, price } : entry
          );
        }
        return [...prevData, { timestamp: currentTime, price }];
      });
    }
  }, [price]);

  console.log(price, ":price", unikListeners, "listeners");

  return (
    <div>
      <LineChart priceData={priceData} />
    </div>
  );
};
