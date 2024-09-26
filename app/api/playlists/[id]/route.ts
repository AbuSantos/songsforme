import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

type ParamProp = {
  id: string;
};

export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "UserId is required" }), {
      status: 404,
    });
  }

  try {
    const playlists = await db.playlist.findMany({
      where: { userId: id as string },
      include: {
        listednft: true,
      },
    });

    const path = req.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    return new Response(JSON.stringify(playlists), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "UserId is required" }), {
      status: 500,
    });
  }
};
