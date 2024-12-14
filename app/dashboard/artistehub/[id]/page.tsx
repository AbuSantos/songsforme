import { ArtiseHub } from "@/components/artiste-hub/artiste-hub"

const Artiste = async ({ params }: { params: { id: string } }) => {
    const userId = params.id
    if (!userId) return

    return (
        <div className="px-1 py-6">
            <ArtiseHub userId={userId} />
        </div>
    )
}

export default Artiste
