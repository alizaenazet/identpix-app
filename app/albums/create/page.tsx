"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { insertAlbum } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { useState } from "react";

export default function Page() {
  const {data:session} = useSession()
    if (!session) {
        return <div>
          <a href="/dashboard">
            <p>please login first</p>
          </a>
        </div>
    }

  const initialState = { message: "", errors: {} };
  const [state,dispatch] = useFormState(insertAlbum,initialState)
  
  return (
    <main className='flex h-screen flex-col  justify-center items-center p-16'>
        <div className="flex flex-col items-start justify-center gap-3.5 md:w-[416px]"> 
        
        <h1 className="font-bold text-2xl">Create your album</h1>
      <form action={dispatch} className="gap-y-3 md: gap-x-3 flex flex-col w-full ">
              <Input className="hidden" type="email" name="email" value={session.user?.email as string} placeholder="email" hidden/>
            <div className="flex flex-1 flex-col gap-1">
                <Label>Title</Label>
                <Input type="text" name="title" placeholder="title" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <Label>Description</Label>
                <Input className="h-full" type="text" name="description" placeholder="description" />
            </div>
            <Button className="w-full" type="submit" >Continue</Button>
    </form>    
        
      </div>
    </main>
  )
}
