
import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';
import useSWR from 'swr'

export async function linkCheck(link:string, access_token:string) {
    const id =  getFolderIdFromUrl(link)

    // cek apakah link valid
    if (!id) {
        return false
    }

    try {

        noStore()
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${access_token}`);
        const response = await fetch(`https://www.googleapis.com/drive/v2/files/${id}`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        });
        const result = await response.json(); // Konversi response ke text
        
        // cek apakah folder bersifat publik
        return result.mimeType == "application/vnd.google-apps.folder" && (response.status <= 400)

        } catch (error) {
        console.error(error);
        return {message: 'Invalid attachment link',}      
        }

        return false
        }


export function getFolderIdFromUrl(url: string){
    try {
      const regex = /\/folders\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/;
      const match = url.match(regex);

    // Return the matched ID or null if no match is found
    if (match) {
        return match[1] || match[2] || null;
    }
    return null;
    
    } catch (error) {
      // Error handling for invalid URLs
      console.error('Invalid URL provided:', error);
      return null;
    }
  }


  export async function getImagesIds(links:string[],access_token:string):Promise<string[]> {
    let images:string[] = []

    const fetchPromises = links.map(async (link: any) => {
        const imagesLink = await getLinkImagesId(link,access_token)
        if (imagesLink) {
            images = images.concat(imagesLink)
        }
    })

    // Menunggu semua fetch selesai
    const imagesArrays = await Promise.all(fetchPromises);
    images = imagesArrays.flat() as unknown as string[]; // Menggabungkan semua array menjadi satu array

    console.log("images co");
    console.log(images);

    return images
  }

  async function getLinkImagesId(link:string,access_token:string):Promise<string[]> {
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
    }

  export function checkUserTokenExpired(expires:string) {
    const expirationDate = new Date(expires);
    const currentDate = new Date();
      
      return currentDate > expirationDate;
  }
    