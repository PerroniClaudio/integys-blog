"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LimitedDropdown from "./LimitedDropdown";
import { Linkedin } from "lucide-react";

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
        <div className="flex gap-8">
          <Link
            href="/"
            className={`font-bold text-3xl ${
              scrolled ? "text-primary" : "text-primary-foreground"
            }`}>
            <div className="flex items-center gap-2 ">
              {/* <div
                className={`p-1 rounded  ${
                  scrolled ? "dark:bg-primary" : "bg-white"
                }`}>
              
                  ? <img src="/integys.png" alt="Integys" className="h-8 w-auto" />

              </div> */}
              
              {scrolled 
                ? (<>
                    <img src="/integys.png" alt="Integys" className="h-10 w-auto dark:hidden" />
                    <img src="/integys-white-sphere.png" alt="Integys" className="h-10 w-auto hidden dark:block" />
                  </>)
                : <img src="/integys-white-sphere.png" alt="Integys" className="h-10 w-auto" />
              }

              <span>INTEGYS</span>
            </div>
          </Link>
          <Link
            href="https://it.linkedin.com/company/integys"
            className={`flex items-center font-bold text-3xl ${
              scrolled ? "text-background dark:text-white" : "text-primary dark:text-secondary"
            }`}>
              <div
                className={`p-[.5] rounded  ${
                  scrolled ? "bg-primary dark:bg-primary" : "bg-white"
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 72 72" width="30" 
                  className={`${scrolled ? "fill-background dark:fill-white" : "fill-primary dark:fill-secondary"}`}
                >
                  <path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"/>
                </svg>
              </div>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          {/* Per ora la'area riservata non è attiva */}
          {/* <LimitedDropdown session={session} /> */}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
export default NavbarClient;
