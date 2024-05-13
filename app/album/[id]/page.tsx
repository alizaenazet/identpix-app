import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button";
import { sql } from '@vercel/postgres'; 
import { redirect } from "next/navigation";
import { notFound } from 'next/navigation'
import { Albums } from "@/app/definitions/types";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
    async function getAlbumInfo() {
        try {
            
            const result = await sql`
            SELECT 
            albums.id,
            albums.title,
            albums.description,
            albums.isPublished,
            albums.user_email,
            gdrive_links.id as gdrive_id,
            gdrive_links.links
            FROM 
                albums
            LEFT JOIN 
                gdrive_links ON albums.id = gdrive_links.album_id
            WHERE 
                albums.id = ${params.id};`;
    
            if (result.rows.length > 0) {
                return result.rows
            }
    
        } catch (error) {
            console.log("🔥 error happen :");
            console.log(error);
            return {message: 'Database Error: Failed to load an album data.',}      
        }
    
        return null
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const albumInfo:Albums[] | null = await getAlbumInfo() as unknown as Albums 
    if (albumInfo == null) {
        notFound()
    }

    const albumDetail = albumInfo[0]

    console.log("albumInfo");
    console.log(albumInfo);
    
    return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
    <Card>
        <CardHeader>
            <CardTitle>{albumInfo[0]!.title}</CardTitle>
            <CardDescription>{albumInfo[0]!.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Link href={`/album/${albumDetail.id}/find`}>
                <Button>Start find my photos</Button>
            </Link>
        </CardContent>
        <CardFooter>
            <p className="text-sm font-light">You are in demo version, sometimes you will get some problem. You can report to us support@identpix.com <a href="support@identpix.com">support@identpix.com</a></p>
        </CardFooter>
    </Card>

    </div>
  )
}
