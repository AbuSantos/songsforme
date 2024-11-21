"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LineChart from "./chart/line-chart";
import { calculateDecayedPlaylistCount } from "@/actions/helper/calculate-playlist";
import { calculateDecayedUniqueListeners } from "@/actions/helper/calculate-uniquelisterner";
import { calculateDynamicPrice } from "@/dynamic-price/main";
import { ListedNFT } from "@/types";
import { savePrice } from "@/actions/save-price";

type PriceDataType = {
  timestamp: string; // ISO date string
  price: number; // Price of the NFT at that timestamp
};

export const TrackChart = ({ track }: { track: ListedNFT }) => {
  const [unikListeners, setUnikListeners] = useState(0);
  const [playlistListing, setPlaylistListing] = useState(0);
  const [priceData, setPriceData] = useState<PriceDataType[]>([]);

  // Check for `track` availability before fetching data
  if (!track) {
    toast.error("Please connect your wallet!");
  }

  // Combined data fetch for listeners and playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listeners, playlists] = await Promise.all([
          calculateDecayedUniqueListeners(track.id),
          calculateDecayedPlaylistCount(track.id),
        ]);
        setUnikListeners(listeners);
        setPlaylistListing(playlists);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [track.id]);

  // Calculate dynamic price and update `priceData`
  useEffect(() => {
    const updatePriceData = async () => {
      const calculatedPrice = await calculateDynamicPrice(
        track.price,
        track.recentPlays,
        unikListeners
      );

      const now = new Date().toISOString();

      setPriceData((prevData) => {
        const today = now.slice(0, 10);
        const lastEntry = prevData[prevData.length - 1];

        // Only update today's entry or add a new one
        if (lastEntry && lastEntry.timestamp.startsWith(today)) {
          return prevData.map((entry, index) =>
            index === prevData.length - 1 ? { ...entry, price: calculatedPrice } : entry
          );
        } else {
          return [...prevData, { timestamp: now, price: calculatedPrice }];
        }
      });

    };


    updatePriceData();
  }, [unikListeners, playlistListing, track.recentPlays]);

  useEffect(() => {
    const addPrice = async () => {
      if (priceData) {
        await savePrice(priceData, track?.id)
      }
    }
    addPrice()
  }, [priceData])


  return (
    <div className="w-11/12 md:w-full p-2">
      {track?.priceData && track?.priceData?.length > 0 ? (
        <LineChart priceData={track?.priceData} nftAddress={track?.contractAddress} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};
