"use client"

import { useSession } from "next-auth/react";
import DashboardPage from "@/app/ui/dashboard/dashboardPage";
import { UserSession } from '../definitions/auth/types';
import { checkUserTokenExpired } from "../lib/helper";
import { redirect } from "next/navigation";

export default function Page() {
    const {data:session} = useSession()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userSession: UserSession = session    
    
    if (!session) {
      redirect('/login')
    }
    
  return (
    <DashboardPage
        userSession={userSession}
    />
  )
}