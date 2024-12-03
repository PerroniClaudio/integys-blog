
// Creare il dropdown per il login, la visualizzazione della mail dell'utente loggato e il logout. vedere il dropdown utilizzato per la modifica del tema

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LimitedDropdown({session}: {session: Session | null}) {

  const router = useRouter()

  const handleLogout = async () => {
    signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span>Area riservata</span>
          {/* <span className="sr-only">Toggle theme</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded" align="end">
        {!!session 
          ? (
            <>
              <DropdownMenuItem >{/* className="cursor-pointer" onClick={()=>{router.push("/riservata"); router.refresh();}} */}
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

        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
