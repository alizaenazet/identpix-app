import { Button } from '@/components/ui/button'
import React from 'react'

export default function CopyButton({text}:{text:string}) {
  return (
    <Button className='md: ml-1'  variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(text)} >
        <span className=" material-symbols-outlined">content_copy</span> 
    </Button>
  )
}
