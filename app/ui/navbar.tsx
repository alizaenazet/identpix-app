"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image  from "next/image";
import { signOut } from "next-auth/react";
import { UserSession } from "../definitions/auth/types";
import Link  from "next/link";
import { Button } from "@/components/ui/button";


export default function Navbar({userSession}:{userSession:UserSession}) {
  const user = userSession.user
  return (
    <div className='w-full flex flex-row  flex-wrap gap-2 items-end justify-between'>
            <div className='w-max flex flex-row gap-2 items-end justify-start'>
                <DropdownMenu>
                <DropdownMenuTrigger>
                <Image
                src={user.picture as string}
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
                <p className='text-sm md:text-base font-semibold'>{user?.name}</p>
                <p className='text-sm md:md:text-base text-normal'>{user?.email}</p>
            </div>
            </div>

            <Link className='hidden md:block' href={"/albums/create"}>
                <Button className='md:text-sm'>
                    Create album
                </Button>
            </Link>
        </div>
  );
}
