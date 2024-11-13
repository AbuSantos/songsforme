"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { AllMySingle } from "./all-singles";

// Fetch singles based on the userId (wallet address)
const SingleMusic = () => {


    // Pass the filtered singles to the client component
    //@ts-ignore
    return <AllMySingle />;
};
export default SingleMusic