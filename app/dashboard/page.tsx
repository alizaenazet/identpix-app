"use client"

import React from 'react'
import { useSession } from "next-auth/react";
import {LoginPage} from "@/app/ui/dashboard/loginPage";
import Image  from "next/image";
import { signOut } from "next-auth/react";
import { UserSession } from '../definitions/auth/types';

export default function Page() {
    const {data:session} = useSession()
    if (!session) {
        return <LoginPage/>
    }
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userSession: UserSession = session
    
    
  return (
    <div className='py-3 px-7 flex flex-col items-center justify-start gap-7'>
        <h1 className='font-bold text-5xl'>Dashboard page</h1>
        <div className='w-full flex flex-row gap-2 items-start justify-start'>
            <button onClick={() => signOut()}>
                <Image
                src={userSession.user.picture as string}
                width={55}
                height={55}
                alt='icon'
                />
            </button>
            <div className='flex flex-col  items-start justify-center'>
                <p>{session.user?.name}</p>
                <p>{session.user?.email}</p>
            </div>
        </div>
    </div>
  )
}