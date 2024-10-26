
const page = ({ params }: { params: { id: string } }) => {
    const id = params.id
    if (!id) return

    console.log(id, "from track info")
    return (
        <div>
            Params
        </div>
    )
}

export default page
