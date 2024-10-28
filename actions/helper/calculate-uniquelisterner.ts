"use server";
import { db } from "@/lib/db";
const calculateDecayRate = () => Math.log(2) / 86400;

export const calculateDecayedUniqueListeners = async (nftId: string) => {
  // Fetch unique listeners for the past 7 days
  const recentListenerRecords = await db.uniqueListener.findMany({
    where: { nftId },
    orderBy: { date: "desc" },
    take: 7,
  });
  console.log(recentListenerRecords, "recent listeners");

  const currentTime = Date.now() / 1000;
  const decayRate = calculateDecayRate();

  // Calculate decayed unique listener count
  const decayedListenerCount = recentListenerRecords.reduce((total, record) => {
    const recordTime = new Date(record.date).getTime() / 1000;
    const timeSinceRecord = currentTime - recordTime;
    const decayedCount =
      record.listenerCount * Math.exp(-decayRate * timeSinceRecord);
    return total + decayedCount;
  }, 0);

  return decayedListenerCount;
};
