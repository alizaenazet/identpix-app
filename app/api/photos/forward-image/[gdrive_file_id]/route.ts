import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache';



export async function GET(request: Request,{ params }: { params: { gdrive_file_id: string } }) {
    const fileId = params.gdrive_file_id
  try {
        noStore()
        const response = await fetch(`https://drive.usercontent.google.com/download?id=${fileId}`);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        return new Response(Buffer.from(buffer), {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }
        )
      } catch (error) {
      Response.json({ error: 'Failed to fetch image' });
      }
  return Response.json({"messagee" : params.gdrive_file_id})
}