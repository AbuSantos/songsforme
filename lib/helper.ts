"use server";
import { cookies } from "next/headers";

export const getSession = async () => {
  const address = cookies().get("session")?.value;

  if (!address) {
    console.log("please connect your wallet");
  }

  return address;
};
