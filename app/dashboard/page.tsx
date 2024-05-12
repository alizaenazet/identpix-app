"use client"

import { useSession } from "next-auth/react";
import LoginPage from "@/app/ui/dashboard/loginPage";
import DashboardPage from "@/app/ui/dashboard/dashboardPage";
import { UserSession } from '../definitions/auth/types';

export default function Page() {
    const {data:session} = useSession()

    if (!session) {
        return <LoginPage/>
    }
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userSession: UserSession = session
    
    console.log("🦠 userSession");
    console.log(userSession);
    
    
    
  return (
    <DashboardPage
        userSession={userSession}
    />
  )
}