"use client"
import { Button } from "@/components/ui/button"
import { deleteAlbum} from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { toast } from "sonner"
import { useState } from "react";


export default function DeleteAlbumButton({
  setIsDeleting, 
  albumId
}:{
  setIsDeleting:(status:boolean) => void,
  albumId: string
}) {
  const initialState = { message: "" };
  const [state,dispatch] = useFormState(deleteAlbum,initialState)

  
  return (
    <form action={dispatch}>
      <input type="text" name="id" defaultValue={albumId} hidden />
      <Button type="submit" variant="destructive" size="sm" onClick={() => setIsDeleting(true)}>Delete</Button>
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
