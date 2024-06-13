"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LimitedDropdown from "./LimitedDropdown";

type Props = {
  shouldChangeColor: boolean;
  session: Session | null;
};

function NavbarClient({ shouldChangeColor, session }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    signOut();
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 500;
      setScrolled(isScrolled);
    };

    if (shouldChangeColor) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setScrolled(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldChangeColor]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full border-b-2 z-30 ${
        scrolled
          ? "bg-background border-primary"
          : "bg-primary border-primary-foreground dark:bg-secondary dark:border-primary-foreground"
      }`}>
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-5">
        <Link
          href="/"
          className={`font-bold text-3xl ${
            scrolled ? "text-primary" : "text-primary-foreground"
          }`}>
          <div className="flex items-center gap-1 ">
            <div
              className={`p-1 rounded  ${
                scrolled ? "dark:bg-primary" : "bg-white"
              }`}>
              <img src="/integy.png" alt="Integys" className="h-8 w-auto" />
            </div>

            <span>INTEGYS</span>
          </div>
        </Link>
        <div className="flex gap-4 items-center">
          {/* {!!session ? ( <button onClick={handleLogout}  className="bg-primary rounded h-fit w-fit px-2 py-1 font-semibold">Logout</button> ) : ( <Link href="/riservata" className="bg-primary rounded h-fit w-fit px-2 py-1 font-semibold">Area riservata</Link> ) } */}
          <LimitedDropdown session={session} />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
export default NavbarClient;
