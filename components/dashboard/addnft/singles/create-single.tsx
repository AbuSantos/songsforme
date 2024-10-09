"use client"
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/errorsandsuccess/form-error";
import { FormSuccess } from "@/components/errorsandsuccess/form-success";
import { createSingleSong } from "@/actions/create-single";
import { useActiveAccount } from "thirdweb/react";

export const CreateSingle = () => {
    // Get the active account from thirdweb
    const account = useActiveAccount();

    // Ensure userId is extracted safely in case account is null or undefined
    const userId = account?.address ?? "";

    // useTransition provides a way to handle UI updates outside of React's concurrent rendering
    const [isPending, startTransition] = useTransition();

    // State for input fields and form status
    const [artistName, setArtistName] = useState<string>("");  // Corrected setter naming
    const [songName, setSongName] = useState<string>("");
    const [isError, setIsError] = useState<string>("");  // Used for form error feedback
    const [isSuccess, setIsSuccess] = useState<string>("");  // Used for success feedback

    /**
     * handleSubmit
     * Validates form input and sends data to the `createSingleSong` function.
     * Displays toast messages and updates the form's error or success state based on the response.
     */
    const handleSubmit = async () => {
        // Ensure all required fields are filled before submitting
        if (!userId || !artistName || !songName) {
            setIsError("Please fill in all fields.");  // Error shown when required fields are empty
            return;
        }

        // Use React's transition API to defer the state update until the async work is done
        startTransition(() => {
            createSingleSong(userId, artistName, songName)
                .then((data) => {
                    // Display success toast and reset form inputs
                    toast(songName, {
                        description: data?.message,
                    });
                    setIsSuccess("Song created successfully!");
                    setSongName("");
                    setArtistName("");  // Clear form after successful submission
                    setIsError("");  // Clear error on success
                })
                .catch((error) => {
                    // Handle and log errors during the API call
                    console.error("Error:", error);
                    toast("Error", {
                        description: "An error occurred. Please try again.",
                    });
                    setIsError("Failed to create the song.");
                    setIsSuccess("");  // Clear success on error
                });
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {/* Trigger button for opening the song creation form */}
                <Button variant="outline" className="text-gray-800" size="nav">Single</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h3 className="text-gray-200 text-center p-2">Song Details</h3>
                <div className="flex flex-col space-y-3">
                    {/* Input for Artist Name */}
                    <Input
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}  // Corrected setter
                        placeholder="Artist Name"
                        disabled={isPending}  // Disable input while request is pending
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                    {/* Input for Song Title */}
                    <Input
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        placeholder="Song Title"
                        disabled={isPending}  // Disable input while request is pending
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                    {/* Show error or success messages if any */}
                    <FormError message={isError} />
                    <FormSuccess message={isSuccess} />
                </div>

                {/* Button to submit form */}
                <Button
                    disabled={isPending}  // Disable button while request is processing
                    onClick={handleSubmit}
                    size="nav"
                    className="mt-3 w-full bg-slate-50 text-gray-950"
                >
                    {isPending ? "Creating..." : "Create Single"}  {/* Show loading state */}
                </Button>
            </PopoverContent>
        </Popover>
    );
};
