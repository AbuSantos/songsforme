import React from 'react'

export const ShareToTwitter = ({ songUrl, songName, }: { songUrl: string, songName: string | undefined | null }) => {

    const handleShare = () => {
        const text = encodeURIComponent(`Listening to ${songName}`)
        const url = encodeURIComponent(songUrl)
        const hashtags = encodeURIComponent("musicNFT,bullchord");
        const twitterUrl = `https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}&via=bullchord`;
        window.open(twitterUrl, "_blank", "noopener,noreferrer");

    }
    return (
        <div>
            <p onClick={handleShare} className="flex items-center justify-start space-x-2 capitalize text-gray-100 bg-[var(--button-bg)]  py-2 px-4 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24" width={24} height={24}>
                    <path d="m18.9,1.153h3.682l-8.042,9.189,9.46,12.506h-7.405l-5.804-7.583-6.634,7.583H.469l8.6-9.831L0,1.153h7.593l5.241,6.931,6.065-6.931Zm-1.293,19.494h2.039L6.482,3.239h-2.19l13.314,17.408Z" />
                </svg>
                <span>
                    Share on twitter
                </span>
            </p>
        </div>
    )
}
