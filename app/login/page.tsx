"use client"
import React, { useEffect } from 'react'

import Image from "next/image"
import { signIn,useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation';
import LoadingDisplay from '../ui/loadingDisplay';


export default function Page() {
    const { data: session, status } = useSession()

    if (session) {
        redirect('/dashboard')
    }
    
    return (
        <div className="w-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <div className="grid gap-4">
                <Button variant="outline" className="w-full" onClick={() => signIn('google',{callbackUrl:"/dashboard"})}>
                  Login with Google
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <div className='w-full h-full flex flex-col gap-3 items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500'>
              <Image 
              src={"/images/login_image.png"}
              width={607}
              height={405}
              alt=''
              />
            </div>
          </div>
        </div>
      )
}
