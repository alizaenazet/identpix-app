import {
    Card,
    CardContent,
  } from "@/components/ui/card"

export default function LoadingDisplay() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <Card className='flex flex-col gap-2 items-center justify-center'>
            <CardContent className="p-3">
            <span className="animate-spin material-symbols-outlined">sync</span>
            </CardContent>
            <p className='animate-pulse text-sm md:text-base font-semibold text-center'>we are processing, please be patient</p>
        </Card>
    </div>
  )
}
