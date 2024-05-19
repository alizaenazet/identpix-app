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


import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


import {updatetAlbum, synchAlbumFiles } from "@/app/lib/actions";
import LinkList from "@/app/ui/album/linkLinst";
import useSWR from 'swr'
import { Albums } from "@/app/definitions/types";
import { useState } from "react";
import { useFormState } from "react-dom";
import CopyButton from "@/app/ui/dashboard/copyButton";
import { revalidatePath } from "next/cache";
import DeleteAlbumButton from "@/app/ui/album/deleteAlbumButton";
import { redirect } from "next/navigation";

export default  function AlbumUpdateSheet({album} : {album: Albums}) {
  const [isDeleting,setIsDeleting] = useState(false)
  const initialState = { message: "", errors: {} };
  const [state,dispatch] = useFormState(updatetAlbum,initialState)
  const [isLoadingSynchronize, setIsLoadingSynchronize] = useState(false)

  console.log(album);
  
  return (
    <Sheet>
    <SheetTrigger asChild disabled={isDeleting} >
      <Button variant="outline">{isDeleting ? "Deleting.." : "✏️ Edit"}</Button>
    </SheetTrigger>
    <SheetContent side={'bottom'} className="h-[65%]">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <ScrollArea className="h-[100%]  cok">
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
                  {!album.ispublished && <p className="text-sm font-light text-left text-red-500">
                    Your album need to Synchronize for can be accessible publicly
                    </p>}
              </div>
            </div>
          </SheetTitle>
          <SheetDescription className="text-start">
            Make changes to your album here. Click save when you're done.
            <Separator className="my-4" />
          </SheetDescription>
          
        </SheetHeader>
        <Card>
        <CardContent className="p-2 md:p-6">

        <form className="grid gap-4 py-4" action={dispatch}>
          <Input id="albumId" name="albumId" defaultValue={album.id} className="col-span-3 hidden" />
          <div className="flex flex-col gap-1 items-start justify-center pr-1">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" name="title" defaultValue={album.title} className="w-full" />
          </div>
          <div className="flex flex-col gap-1 items-start justify-center pr-1">
            <Label htmlFor="description" className="text-right text-sm">
              Description
            </Label>
            <Input id="description" name="description" defaultValue={album.description} className="w-full" />
          </div>
          <div className="grid grid-cols-4 items-start justify-start gap-4 ">
            <div className="flex flex-row gap-1 justify-start items-start flex-wrap">
            <SheetClose disabled={isLoadingSynchronize} asChild>
              <Button size="sm" type="submit">Save changes</Button>
            </SheetClose>
            </div>
          </div>
        </form>
        </CardContent>
        <CardFooter className="p-2 md:px-6 md:py-0 md:pb-6">

          <div className=" w-full flex flex-row flex-warp gap-1.5 items-start justify-start">
          <SheetClose asChild >
                <DeleteAlbumButton 
                albumId={album.id} setIsDeleting={(status:boolean) => setIsDeleting(status)} 
                isPublished={album.ispublished}
                />
          </SheetClose>
          <Button className="bg-green-600" 
              type="button"
              size="sm"
              disabled={!album.ispublished && (album.links! ?? []).length < 1}
              onClick={ async () => {
                setIsLoadingSynchronize(true)
                const result = await synchAlbumFiles(album.gdrive_id!,album.id)              
                setIsLoadingSynchronize(false)
              }}>
                  {isLoadingSynchronize ? <span className="animate-spin material-symbols-outlined">sync</span>: "Synchronize album"}
            </Button>

          </div>
        </CardFooter>
        </Card>

        {state?.errors &&
          <p className="text-sm text-slate-200">{state.message}</p>
        }

        <SheetFooter>
        <div className=" w-full flex flex-col items-start justify-center ">
          <LinkList 
          gdriveId={album.gdrive_id ?? -1}
          isNewAlbum={album.gdrive_id == null}
          albumId={album.id}
          links={album.links ?? []}
          />
        </div>
        </SheetFooter>
        </ScrollArea>

    </SheetContent>
  </Sheet>
  )
}
