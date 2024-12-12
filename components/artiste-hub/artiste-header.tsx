import Image from "next/image"

type ArtisteHeaderType = {
    imageUri: string,
    bio: string,
    followers: number,
    name: string
}
export const ArtisteHeader = ({ imageUri, bio, followers, name }: ArtisteHeaderType) => {
    return (
        <div>
            <Image src={imageUri} alt={name} width={150} height={150} />
            <div>
                <p>{name}</p>
                <small>{bio}</small>
                <p>{followers}</p>
            </div>
        </div>
    )
}
