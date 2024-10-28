"use client";

import { calculateDecayedPlaylistCount } from "@/actions/helper/calculate-playlist";
import { calculateDecayedUniqueListeners } from "@/actions/helper/calculate-uniquelisterner";
import { calculateDynamicPrice } from "@/dynamic-price/main";
import { ListedNFT } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LineChart from "./chart/line-chart";

export const TrackChart = ({ track }: { track: ListedNFT }) => {
  const [unikListeners, setUnikListeners] = useState(0);
  const [playlistListing, setPlaylistListing] = useState(0);
  const [price, setPrice] = useState(0);

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
  // useEffect(() => {
  //   const fetchPlaylistListings = async () => {
  //     const uniquePlaylist = await calculateDecayedPlaylistCount(track?.id);
  //     setPlaylistListing(uniquePlaylist);
  //   };
  //   fetchPlaylistListings();
  // }, [track?.id]);

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
    };
    fetchDynamicPrice();
  }, [track?.id, playlistListing, unikListeners]);

  console.log(price, ":price", unikListeners, "listeners")

  return <div>
    <LineChart />
  </div>;
};
