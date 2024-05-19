'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres'; 
import { Albums } from '../definitions/types';
import { unstable_noStore as noStore } from 'next/cache';
import { linkCheck,getFolderIdFromUrl,getImagesIds } from "@/app/lib/helper";
import { authOptions } from "@/app/lib/authOptions"
import { getServerSession } from "next-auth/next"
import { UserSession } from '@/app/definitions/auth/types';

import {s3Client} from '@/app/lib/s3-client'
import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import Papa from 'papaparse';

export async function getAlbums(email:string) {
    
    try {
        noStore()
        const result = await sql`SELECT * FROM albums WHERE user_email = ${email}`
        // const result = await sql`SELECT * FROM albums`
    
        if (result.rows[0]) {
            return result.rows as [Albums]
        }

    } catch (error) {
        
    }

    return []
}


const CreateAlbumSchema = z.object({
    email: z.string().email().min(3),
    title: z.string().max(100, {message: "title is a maximum of 100 characters"}).min(3),
    description: z.string().max(320, {message: "description is a maximum of 320 characters"})
})


export type CreateAlbumState = {
    errors?: {
      email?: string[];
      title?: string[];
      description?: string[];
    };
    message?: string | null;
  } | undefined;

  const InsertAlbum = CreateAlbumSchema.omit({})
export async function insertAlbum(prevState: CreateAlbumState,formData: FormData) {
    
    const validateFields = InsertAlbum.safeParse({
         email : formData.get('email')?.toString(),
         title : formData.get('title')?.toString(),
         description : formData.get('description')?.toString()
    })

     
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
      }

      const {email,title,description} = validateFields.data

    try {
        const result = await sql`INSERT INTO albums (title, description, user_email) 
        VALUES (${title}, ${description}, ${email});`        

        // return {message: 'success for creating your album'}      
    } catch (error) {
        revalidatePath('/albums/create');
        return {errors: JSON.stringify(error),message: 'Database Error: Failed to create album data.',}      
    }
    
    revalidatePath('/albums/create');
    redirect('/dashboard')
}


const UpdateAlbumSchema = z.object({
    albumId: z.string().min(3),
    title: z.string().max(100).min(3),
    description: z.string().max(320)
})

export type UpdateAlbumState = {
    errors?: {
        albumId?: string[];
      title?: string[];
      description?: string[];
    };
    message?: string | null;
  } | undefined;

const EditAlbum = UpdateAlbumSchema.omit({})
export async function updatetAlbum(prevState: UpdateAlbumState,formData: FormData) {
    
    const validateFields = EditAlbum.safeParse({
        albumId : formData.get('albumId')?.toString(),
         title : formData.get('title')?.toString(),
         description : formData.get('description')?.toString()
    })

     console.log(formData);
     
    if (!validateFields.success) {
        console.log(validateFields.error);
        
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
      }


      
      const {albumId,title,description} = validateFields.data
      console.log("🔥 const {email,title,description} = validateFields.data");
      console.log(albumId);
      console.log(title);
      console.log(description);
      
    try {
        const result = await sql`UPDATE albums
        SET title = ${title}, description = ${description}
        WHERE id = ${albumId};
        `        
        console.log("sukses cuy🔥");
        console.log(result);
    } catch (error) {
        console.log("🔥 error happen :");
        console.log(error);
        return {errors: JSON.stringify(error),message: 'Database Error: Failed to create album data.',}      
    }

    revalidatePath('/dashboard');
}


export async function getAlbumDetailById(albumId: string) {
    try {
        console.log(albumId);
        
        noStore()
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
            albums.id = ${albumId};`;

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


export async function addNewGdriveLink(formData: FormData) {

    console.log("masuk addNEWGdriveLink");
    
    const gdriveId:string = formData.get('gdriveId') as string
    const link:string = formData.get('link') as string
    const albumId:string = formData.get('albumId') as string

    // cek apakah link valid
    // cek apakah folder bersifat publik
    const session = await getServerSession(authOptions)
  
    const userSession: UserSession = session as UserSession

    const folderId = getFolderIdFromUrl(link)
    if (folderId == null) {
        console.log("invalid folder link");
        return {message: 'invalid google drive link, makse sure given public access folder link as viewer or more',}      
    }
    
    const resultCheck = await linkCheck(`https://drive.google.com/drive/folders/${folderId}?usp=sharing`,userSession.user.accessToken as string)
    
    if (!resultCheck) {
        console.log("denied permission to access ");
        return {message: 'invalid google drive link, makse sure given public access folder link as viewer or more',}      
    }

    try {
        const result = await sql`
        WITH inserted AS (
        UPDATE gdrive_links
        SET links = links || ARRAY[${folderId}]
        WHERE id = ${gdriveId}
        )
        UPDATE albums
        SET ispublished = false
        WHERE id = ${albumId};
        `;

        if (result.rowCount > 0) {
            revalidatePath('/dashboard');
            return true
        }
    } catch (error) {
        console.log("🔥 error happen :");
        console.log(error);
        return {message: 'Database Error: Failed to add new links value of  an album data.',}      
    }

    return false
    
}

export async function removeGdriveLink(albumId:string,gdriveId: number,value:string) {
    
    try {
        const result = await sql`
        WITH inserted AS (
        UPDATE gdrive_links
        SET links = array_remove(links, ${value})
        WHERE id = ${gdriveId}
        )
        UPDATE albums
        SET ispublished = false
        WHERE id = ${albumId};         
        `
        
        if (result.rowCount > 0) {
            
            revalidatePath('/dashboard');
            return true
        }
    } catch (error) {
        console.log("🔥 error happen :");
        console.log(error);
        return {message: 'Database Error: Failed to remove a link value of  an album data.',}      
    }
}




export async function createGdrive(formData: FormData) {
    console.log("masuk addNEWGdriveLink");

    const link:string = formData.get("link") as string
    const albumId: string = formData.get("albumId") as string

    // cek apakah link valid
    // cek apakah folder bersifat publik
    const session = await getServerSession(authOptions)
  
    const userSession: UserSession = session as UserSession
    console.log("session");
    console.log(session);

    const folderId = getFolderIdFromUrl(link)
    if (folderId == null) {
        console.log("invalid folder link");
        
        return {message: 'invalid google drive link, makse sure given public access folder link as viewer or more',}      
    }
    
    const resultCheck = await linkCheck(`https://drive.google.com/drive/folders/${folderId}?usp=sharing`,userSession.user.accessToken as string)
    console.log(resultCheck);

    if (!resultCheck) {
        console.log("denied permission to access ");
        
        return {message: 'invalid google drive link, makse sure given public access folder link as viewer or more',}      
        
    }
    
    // insert new value into `gdrive_links` table
    // change the status into draft
    try {
        // const sqlArray = `ARRAY['${folderId}']`;
        
        const result = await sql`
        WITH inserted AS (
            INSERT INTO gdrive_links (links, album_id)
            VALUES (ARRAY[${folderId}], ${albumId})
            RETURNING id
        )
        UPDATE albums
        SET ispublished = false
        WHERE id = ${albumId};        
        `
        if (result.rowCount > 0) {
            revalidatePath('/dashboard');
            return true
        }

    } catch (error) {
        console.log("🔥 error happen :");
        console.log(error);
        return {message: 'Database Error: Failed to add a link value of  an album data.',}      
    }
    
    return false

}

export async function deleteAlbum(
    prevState: {message:string|undefined}, 
    formData: FormData) {

    const albumId = formData.get('id') as string
    const isPublished = (formData.get('isPublished') as string)


    console.log("deleteing for id " + albumId);
    
    try {
        noStore()
        const result = await sql`
        DELETE FROM albums
        WHERE id = ${albumId};
        `
        
        console.log(result);
        if (result.rowCount > 0) {
            // cek is the album already published for delete the csv in file storge
            if (isPublished == "1") {
                const command = new DeleteObjectCommand({
                    Bucket: "gdrive-ids",
                    Key: albumId,
                  });
                
                  try {
                    const response = await s3Client.send(command)
                    if (response.$metadata.httpStatusCode! >= 400 && response.$metadata.attempts! < 1) {
                        return {message: 'Something wrong, try again later'}
                    }
                  } catch (err) {
                    console.error(err);
                  }
            }

            revalidatePath('/dashboard');
            return {message: 'success deleting album'}
        }
        
        return {message: 'Something wrong, try again later'}
    } catch (error) {
        console.log("🔥 error happen :");
        console.log(error);
        return {message: 'Database Error: Failed to remove an album data.',}      
    }
}


export async function synchAlbumFiles(gdriveLinksId: string, albumId:string) {
    console.log("\n\n\n\n\n🔥masuk synch album");
    
    const session = await getServerSession(authOptions)
    const userSession: UserSession = session as UserSession
    const access_token = userSession.user.accessToken as string
    const result = await sql`
    SELECT links FROM gdrive_links
        WHERE id = ${gdriveLinksId};
    `

    const links = result.rows[0].links
    let images:string[] = []

    // Memperbaiki penggunaan async dalam loop
    const fetchPromises = links.map(async (link: any) => {
        
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${access_token}`);
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=%27${link}%27+in+parents+and+mimeType+contains+%27image/%27`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        });
        
        const status = response.status;
        if (status >= 300) {
            console.log("Response status:", status);
            return [];
        }

        const result = await response.json();
        const supportedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        const resultListimageObjct = result.files || [];
        const imagesIds: string[] = resultListimageObjct
            .filter((image: any) => supportedFileTypes.includes(image.mimeType))
            .map((image: any) => image.id);

        return imagesIds;
    });

    // Menunggu semua fetch selesai
    const imagesArrays = await Promise.all(fetchPromises);
    images = imagesArrays.flat(); // Menggabungkan semua array menjadi satu array

    console.log(typeof images);
    console.log(images);
    var csv = Papa.unparse([images]);
    
    const input = {
        "Body": csv,
        "Bucket": "gdrive-ids",
        "Key": albumId
    };
    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command)

    if (response.$metadata.httpStatusCode! >= 400 && response.$metadata.attempts! < 1) {
        return false
    }
    
    await sql`
    UPDATE albums
        SET ispublished = true
        WHERE id = ${albumId};        
    `
    revalidatePath('/dashboard')
    return true
}