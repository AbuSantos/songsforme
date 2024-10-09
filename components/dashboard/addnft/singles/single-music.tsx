"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { AllMySingle } from "./all-singles";

// Fetch singles based on the userId (wallet address)
const SingleMusic = async ({ userId }: { userId: string }) => {
    // Fetch singles where owner matches the userId (wallet address)
    const singles = await db.single.findMany({
        where: {
            owner: userId
        },
    });

    revalidateTag("single")

    // Pass the filtered singles to the client component
    return <AllMySingle singles={singles} />;
};
export default SingleMusic