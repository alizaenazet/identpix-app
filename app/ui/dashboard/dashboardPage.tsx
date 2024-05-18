import React from 'react'
import { UserSession } from "@/app/definitions/auth/types";
import Image  from "next/image";
import { signOut } from "next-auth/react";
import Link  from "next/link";
import { Button } from "@/components/ui/button"
import useSWR from 'swr'
import AlbumUpdateSheet from "@/app/ui/dashboard/albumUpdateSheet";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  import { Albums } from "@/app/definitions/types";



  

export default function DashboardPage( {userSession}:{userSession: UserSession}) {
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR(`/api/albums/${userSession.user.email!}`, fetcher)

    
    
    if (isLoading && !error) {
        return  <p>Loading....</p>
    }
    
  return (
    <div className='py-3 px-7 flex flex-col items-center justify-start gap-7'>
        <h1 className='font-bold text-xl md:text-5xl'>Dashboard</h1>
        <div className='w-full h-screen flex flex-col items-start justify-start gap-9'>
        <div className='w-full flex flex-row  flex-wrap gap-2 items-end justify-between'>
            <div className='w-max flex flex-row gap-2 items-end justify-start'>
                <DropdownMenu>
                <DropdownMenuTrigger>
                <Image
                src={userSession.user.picture as string}
                width={55}
                height={55}
                alt='icon'
                className='rounded-lg'
                />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='pl-2'>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='bg-slate-100 mb-1' onClick={() => signOut()}>Sing-out</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            <div className='flex flex-col  items-start justify-center'>
                <p className='text-sm md:text-base font-semibold'>{userSession.user?.name}</p>
                <p className='text-sm md:md:text-base text-normal'>{userSession.user?.email}</p>
            </div>
            </div>

            <Link className='hidden md:block' href={"/albums/create"}>
                <Button className='md:text-sm'>
                    Create album
                </Button>
            </Link>
        </div>
        <div className='w-full flex flex-col gap-1 items-start justify-start'>
          <h3 className='font-semibold text-3xl mb-0 pb-0'>Albums</h3>
          <Link className=' md:hidden' href={"/albums/create"}>
                  <Button size={'sm'} className=' text-xs'>
                      Create album
                  </Button>
          </Link>
        </div>
        <Table className='w-full h-max'>
        <TableCaption>A list of your recent Albums.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right"> - </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.map((album:Albums) => (
            <TableRow key={album.id}>
              <TableCell className="font-medium text-xs md:text-sm">{album.title}</TableCell>
              <TableCell className='text-xs md:text-sm'>{album.description}</TableCell>
              <TableCell className='text-xs md:text-sm'>{album.ispublished ? "🌍 published" : "📦 draft"}</TableCell>
              <TableCell className="text-right"><AlbumUpdateSheet album={album} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

        </div>
    </div>
  )
}
