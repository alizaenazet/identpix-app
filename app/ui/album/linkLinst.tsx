import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { createGdrive,removeGdriveLink,addNewGdriveLink } from "@/app/lib/actions";

export default function LinkList({gdriveId,albumId,links,isNewAlbum}:{gdriveId: number,albumId:string,links: string[],isNewAlbum: boolean}) {
      return (
    <div className='mt-6 col-span-3 w-full h-max flex flex-col items-start justify-start gap-3 '>
        <div className='w-full flex flex-col items-start justify-start gap-2'>
        <Label  className="text-left">
                G-drive link
        </Label>
        <form action={addNewGdriveLink} className={` h-max w-full flex felx-row gap-2 justify-start ${isNewAlbum ? "hidden" : ""}`} >
            <Input type="number" id="gdriveId" name="gdriveId" value={gdriveId}  className="w-full bg-red-200 hidden"  />
            <Input type="text" id="albumId" name="albumId" value={albumId}  className="w-full bg-red-200 hidden"  />
            <Input id="link" name="link"  className="w-full " />
            <Button type="submit" >Add New</Button>
        </form>
        <form  action={createGdrive} className={`h-max w-full flex felx-row gap-2 justify-start ${isNewAlbum ? "" : "hidden"}`} >
            <Input id="albumId" name="albumId"  className="w-full  hidden" value={albumId} />
            <Input id="link" name="link"  className="w-full" />
            <Button>Add New</Button>
        </form>
        </div>

        <div className="w-full mb-4 h-max flex flex-col items-center justify-start gap-2">
            <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4 ">
            <h4 className="mb-4 text-sm font-medium leading-none">Links</h4>
            {
                links.length < 1 && <div className="w-full h-full flex items-center justify-center"><p className="text-sm text-slate-300">Empty links</p></div>
            }
            {links.map((link) => (
            <>
                <div key={link} className="text-sm flex flex-row justify-between items-end gap-1">
                <p className="text-blue-400 text:sm md:text-base">
                    <a href={`https://drive.google.com/drive/u/0/folders/${link}`}>
                    {link}
                    </a>
                </p>
                <Button size={'icon'}  onClick={async () => {
                    await removeGdriveLink(albumId,gdriveId,link)
                    }} className="h-fit py-1" variant="outline">
                    <span className="text-red-600 material-symbols-outlined">
                    delete</span></Button>
                </div>
                <Separator className="my-2" />
            </>
            ))}
        </div>
        </ScrollArea>
        </div>
    </div>
  )
}
