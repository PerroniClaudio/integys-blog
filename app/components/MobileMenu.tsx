"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function MobileMenu({session}: {session: Session | null}) {

  const router = useRouter();
  const pathname = usePathname() || '';
  const { t } = useTranslation();
  
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';
  const audienceBasePath = locale === 'en' ? 'arguments' : 'argomenti';
  const enterprisesSlug = locale === 'en' ? 'enterprises' : 'aziende';
  const publicAdministrationSlug = locale === 'en' ? 'public-administration' : 'pubblica-amministrazione';

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
          <Link href={`/${typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'it'}/chi-siamo`}>
            Chi siamo
          </Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem>
          <Link href={`/${locale}/servizi`}>
            Servizi
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <Link href={`/${locale}/${audienceBasePath}/${enterprisesSlug}`}>
            {t('home.forEnterprises')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/${locale}/${audienceBasePath}/${publicAdministrationSlug}`}>
            {t('home.forPublicAdministration')}
          </Link>
        </DropdownMenuItem>
          {/* <hr />
        {!!session 
          ? (
            <>
              <DropdownMenuItem >
                <Link href={`/${typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'it'}/riservata`}>
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
                <Link href={`/${typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'it'}/login`}>
                  Accedi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/${typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'it'}/register`}>
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
