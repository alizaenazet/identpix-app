import { getAlbums } from "@/app/lib/actions"

export async function GET(
    request: Request,
  { params }: { params: { email: string } }
) {
    const result = await getAlbums(params.email)
    console.log("result");
    console.log(result);
    
    return Response.json(result)
  }