"use client"
import { Button } from "@/components/ui/button"
import { deleteAlbum} from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { toast } from "sonner"
import { useState } from "react";


export default function DeleteAlbumButton({
  albumId,
  isPublished
}:{
  albumId: string,
  isPublished: boolean
}) {
  const initialState = { message: "" };
  const [state,dispatch] = useFormState(deleteAlbum,initialState)

  
  return (
    <form action={dispatch}>
      <input type="text" name="id" defaultValue={albumId} hidden />
      <input type="number" name="isPublished" defaultValue={isPublished ? 1 : 0} hidden />
      <Button type="submit" variant="destructive" size="sm" >Delete</Button>
      {
          state?.message && <div hidden>
            { toast("Delete album", {
              description: state.message,
              action: {
                label: "Close",
                onClick: () => {},
              },
            }) }
          </div>
        }
    </form>
  )
}