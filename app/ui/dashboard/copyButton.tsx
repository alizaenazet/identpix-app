"use client"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from "sonner"

export default function CopyButton({text}:{text:string}) {
    const [isClicked, setIsClicked] = useState(false)
  return (
    <Button className='md: ml-1'  variant="outline" size="icon" onClick={() => {
        setIsClicked(true)
        toast("Copy album link", {
          description: "album link copied into clipboard",
          action: {
            label: "Close",
            onClick: () => {},
          },
        })
        navigator.clipboard.writeText(text)
        setTimeout(function() {
            setIsClicked(false)
          }, 1000);
        }} >
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <span className={isClicked ? "animate-bounce material-symbols-outlined" : "material-symbols-outlined"}>content_copy</span> 
    </Button>
  )
}
