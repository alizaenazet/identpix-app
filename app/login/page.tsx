"use client"
import React from 'react'

import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation';


export default function Page() {
    const {data:session} = useSession()

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
                <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
                  Login with Google
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      )
}
