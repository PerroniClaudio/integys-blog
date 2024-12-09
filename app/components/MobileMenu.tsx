
// Creare il dropdown per il login, la visualizzazione della mail dell'utente loggato e il logout. vedere il dropdown utilizzato per la modifica del tema

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MobileMenu({session}: {session: Session | null}) {

  const router = useRouter()

  const handleLogout = async () => {
    signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-2">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded bg primary" align="end">

        {/* <DropdownMenuItem>
          <Link href="/chi-siamo">
            Chi siamo
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <Link href="/servizi">
            Servizi
          </Link>
        </DropdownMenuItem>
          {/* <hr />
        {!!session 
          ? (
            <>
              <DropdownMenuItem >
                <Link href="/riservata">
                  Vai all&apos;area riservata
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              { !!session?.user?.email &&
                <DropdownMenuItem>
                  {session?.user?.email}
                </DropdownMenuItem>
              }
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </>
          )
          : (
            <>
              <DropdownMenuItem>
                <Link href="/login">
                  Accedi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/register">
                  Registrati
                </Link>
              </DropdownMenuItem>
            </>
          )

        } */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
