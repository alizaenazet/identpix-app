"use client"
import {IdentpixLogo} from "@/app/ui/identpixLogo"
import React from "react";
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    
  } from "@nextui-org/navbar";

  import {Button} from "@nextui-org/button";
import { signOut } from "next-auth/react";
import Link  from "next/link";

export default function App() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href={"/dashboard"}>
            <IdentpixLogo />
        </Link>
        <Link href={"/dashboard"}>
            <p className="font-bold text-inherit">IdentPix</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => signOut()} color="primary" variant="flat">
            LogOut
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
