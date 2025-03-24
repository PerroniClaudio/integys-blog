"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModeToggle from "../ModeToggle";
import { Session } from "next-auth";
import AdminMobileMenu from "./AdminMobileMenu";

type Props = {
  session: Session | null;
};

function AdminNavbarClient({ session = null }: Props) {


  return (
    <>
      <nav className={`fixed top-0 left-0 w-full border-b-2 z-30 bg-primary border-primary-foreground dark:bg-secondary dark:border-primary-foreground`}>
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-8 py-3">
          <div className="flex gap-4 items-center pr-2">
            <Link
              href="https://integys.com/"
              className={`font-bold text-2xl sm:text-3xl text-primary-foreground`}>
              <div className="flex items-center gap-2 ">
                
                <img src="/integys-white-sphere.png" alt="Integys" className="h-8 sm:h-10 w-auto" />

                <span>INTEGYS</span>
              </div>
            </Link>
            <Link href="/" className="font-semibold text-white text-lg">
              Home
            </Link> 
            <Link href="/admin" className="font-semibold text-white text-lg">
              Dashboard
            </Link> 
            {/* <Link href="/chi-siamo" className="font-semibold text-white">
              Chi siamo
            </Link>  */}
          </div>
          <div className="flex gap-4 items-center">
            
            <div className="sm:hidden">
                <AdminMobileMenu session={session} />
            </div>

            <ModeToggle />
          </div>
        </div>
      </nav>
      
      
    </>
  );
}
export default AdminNavbarClient;
