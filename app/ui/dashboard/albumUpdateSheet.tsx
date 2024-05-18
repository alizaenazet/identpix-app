"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import  Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { deleteAlbum,updatetAlbum, synchAlbumFiles } from "@/app/lib/actions";
import LinkList from "@/app/ui/album/linkLinst";
import useSWR from 'swr'
import { Albums } from "@/app/definitions/types";
import { useState } from "react";
import { useFormState } from "react-dom";
import CopyButton from "@/app/ui/dashboard/copyButton";


export default  function AlbumUpdateSheet({album} : {album: Albums}) {
  const [isDeleting,setIsDeleting] = useState(false)
  const initialState = { message: "", errors: {} };
  const [state,dispatch] = useFormState(updatetAlbum,initialState)
  const [isLoadingSynchronize, setIsLoadingSynchronize] = useState(false)

  const fetcher = (url:string) => fetch(url).then(r => r.json())
  const { data, error,isLoading } = useSWR(`/api/albums/detail/${album.id}`, fetcher)
  

  if (isLoading) {
    return <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="text-sm font-medium">Loading for ${album.title} album</p>
    </div>
  }

  const albumDetail = data[0]  
  const albumLinks = albumDetail.links ?? []
  return (
    <Sheet>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <SheetTrigger asChild disabled={isDeleting} >
      <Button variant="outline">{isDeleting ? "Deleting.." : "✏️ Edit"}</Button>
    </SheetTrigger>
    <SheetContent side={'bottom'} className="max-h-[75%]">
      <SheetHeader>
        <SheetTitle>
          <div className="w-full gap-3 flex flex-col items-start justify-start">
            <div className="w-full flex flex-col gap-1 items-start justify-end">
              <p className="text-base ">Edit album</p>
              <p className="text-base font-medium">Status: {album.ispublished ? "🌍 published" : "📦 draft"}</p>
            </div>
            <div className="w-full felx ">
                {album.ispublished && <p  className="w-full text-start text-sm md:text-base font-light text-green-500">
                    Share your album: 
                      <a className="font-medium" href={`https://identpix-app.vercel.app/album/${album.id}`}>
                        identpix-app.vercel.app/album/{album.id}
                      </a>
                      <br className=""/>
                      <CopyButton text={`https://identpix-app.vercel.app/album/${album.id}`}/>
                    </p>
                  }
                {!album.ispublished && <p className="text-sm font-light text-red-500">
                  Your album need to Synchronize for can be accessible publicly
                  </p>}
            </div>
          </div>
        </SheetTitle>
        <SheetDescription>
          Make changes to your album here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="h-fit w-full pr-3 rounded-md border">

      <form className="grid gap-4 py-4" action={dispatch}>
        <Input id="albumId" name="albumId" value={album.id} className="col-span-3 hidden" />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input id="title" name="title" defaultValue={album.title} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input id="description" name="description" defaultValue={album.description} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start justify-start gap-4 ">
        <Label  className="text-right">
          </Label>
          <div className="col-span-3 flex flex-row gap-1 justify-start items-start">
          <SheetClose asChild >
            <Button variant="destructive" onClick={async () => {setIsDeleting(true) ; await deleteAlbum(album.id)}}> Delete</Button>
          </SheetClose>
          <SheetClose disabled={isLoadingSynchronize} asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
            <Button className="bg-green-600" 
            type="button"
            disabled={!albumDetail.ispublished && albumLinks?.length < 1}
            onClick={ async () => {
              console.log("rine loh cok");
              setIsLoadingSynchronize(true)
              const result = await synchAlbumFiles(albumDetail.gdrive_id,album.id)              
              console.log("result cik kiw");
              console.log(result);
              
              setIsLoadingSynchronize(false)
            }}>
                {isLoadingSynchronize ? "Loading🔄 Synchronizing album..., please wait🙏" : "Synchronize album"}
              </Button>
          </div>
        </div>
      </form>

      {state?.errors &&
        <p className="text-sm text-slate-200">{state.message}</p>
      }

      </ScrollArea>

      {isLoadingSynchronize && <p className="w-full text-center text-base font-semibold text-slate-400">
        Loading🔄 Synchronizing album...,<br />please wait🙏
      </p>}
      <SheetFooter>
      <div className="w-full flex flex-col items-start justify-center ">
        <LinkList 
        gdriveId={albumDetail.gdrive_id ?? -1}
        isNewAlbum={albumDetail.gdrive_id == null}
        albumId={album.id}
        links={albumLinks ?? []}
        />
      </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  )
}
