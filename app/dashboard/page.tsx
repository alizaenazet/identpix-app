import React from 'react'
import { UserSession } from "@/app/definitions/auth/types";
import Link  from "next/link";
import { Button } from "@/components/ui/button"
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

import Navbar from "@/app/ui/navbar";
import { Albums } from "@/app/definitions/types";
import { getAlbums } from '@/app/lib/actions';
import {authOptions} from '@/app/lib/authOptions';
import { getServerSession } from "next-auth/next"

export default async function Page() {

  const session = await getServerSession(authOptions)
  console.log("session cuy");
  console.log(session);
  const userSession = session as UserSession

  const data = await getAlbums(userSession.user.email!)
  
  return (
    <main className='py-3 px-7 flex flex-col items-center justify-start gap-7'>
        <h1 className='font-bold text-xl md:text-5xl'>Dashboard</h1>
        <div className='w-full h-screen flex flex-col items-start justify-start gap-9'>
          <Navbar userSession={userSession} />
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
    </main>
  )
}