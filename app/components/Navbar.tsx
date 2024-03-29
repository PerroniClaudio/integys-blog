"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";

function Navbar({ shouldChangeColor }: { shouldChangeColor: boolean }) {
  const [scrolled, setScrolled] = useState(false);

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

        <ModeToggle />
      </div>
    </nav>
  );
}
export default Navbar;
