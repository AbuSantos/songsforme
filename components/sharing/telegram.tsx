"use client";

export const ShareToTelegram = ({
    songUrl,
    songName,
}: {
    songUrl: string;
    songName: string | undefined | null;
}) => {
    const shareToTelegram = () => {
        const telegramBaseUrl = "https://t.me/share/url";
        const encodedUrl = encodeURIComponent(songUrl);
        const encodedText = encodeURIComponent(
            songName ? `Listening to ${songName}` : "Check out this song!"
        );

        try {
            window.open(
                `${telegramBaseUrl}?url=${encodedUrl}&text=${encodedText}`,
                "_blank",
                "noopener,noreferrer"
            );
        } catch (err) {
            console.error("Failed to open Telegram share link:", err);
        }
    };

    return (
        <button
            onClick={shareToTelegram}
            aria-label={`Share ${songName || "this song"} to Telegram`}
            className="flex items-center justify-start space-x-2 capitalize text-gray-100 bg-[var(--button-bg)] py-2 px-4 rounded-md"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "#fff" }}
            >
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"></path>
            </svg>
            <span>Share to Telegram</span>
        </button>
    );
};
