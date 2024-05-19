import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth";
import { redirect } from 'next/navigation'


const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.apps.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.photos.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
  ];

export const authOptions: NextAuthOptions = {  // Configure one or more authentication providers
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: scopes.join(" "),
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            const currentDate  = Math.floor(Date.now() / 1000)
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (currentDate > token!.exp) {
                redirect('/login')
            }

            return token;
        },
        async session({ session, token, }) {
            const userToken = token
            
            session.user = token;
            // session.accessToken = token.accessToken;
            
            return session;
        },
    },
}