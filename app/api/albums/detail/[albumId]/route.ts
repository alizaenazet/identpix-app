import { getAlbumDetailById,createGdrive } from "@/app/lib/actions"

export async function GET(
    request: Request,
  { params }: { params: { albumId: string } }
) {
    const result = await getAlbumDetailById(params.albumId)
    
    return Response.json(result)
}