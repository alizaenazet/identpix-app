import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/app/ui/sessionWrapper";
import Navbar  from "@/app/ui/navbar";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // /public path
  },
  title: {
    template: '%s | IdentPix',
    default: 'IdentPix Dashboard',
  },
  description: "Identpix Provider dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={inter.className}>
        {children}
      </body>
      <Toaster />
    </html>
    </SessionWrapper>
  );
}
