import Image from "next/image"

type ArtisteHeaderType = {
    imageUri: string,
    bio: string,
    followers: number,
    name: string
}
export const ArtisteHeader = ({ imageUri, bio, followers, name }: ArtisteHeaderType) => {
    return (
        <div className="flex items-start  space-x-2">
            <Image src={imageUri} alt={name} width={200} height={200} />
            <div>
                <p>{name} King Julien</p>
                <small>{bio} Thisis a bio</small>
                <p>{followers} 20</p>
            </div>
        </div>
    )
}
