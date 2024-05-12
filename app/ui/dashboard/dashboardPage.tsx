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
        <h1 className='font-bold text-5xl'>Dashboard page </h1>
        <div className='w-full h-screen flex flex-col items-start justify-start gap-9'>
        <div className='w-full flex flex-row gap-2 items-end justify-between'>
            <div className='w-full flex flex-row gap-2 items-end justify-start'>
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
                <DropdownMenuContent>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Sing-out</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            <div className='flex flex-col  items-start justify-center'>
                <p>{userSession.user?.name}</p>
                <p>{userSession.user?.email}</p>
            </div>
            </div>

            <Link href={"/albums/create"}>
                <Button>
                    Create album
                </Button>
            </Link>
        </div>
        <h3 className='font-semibold text-3xl mb-0 pb-0'>Albums</h3>
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
              <TableCell className="font-medium">{album.title}</TableCell>
              <TableCell>{album.description}</TableCell>
              <TableCell>{album.ispublished ? "🌍 published" : "📦 draft"}</TableCell>
              <TableCell className="text-right"><AlbumUpdateSheet album={album} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

        </div>
    </div>
  )
}
