// import type { Metadata } from "next";

import { getServerSession } from "next-auth";
import LoginForm from "@/app/components/login-form";
import Navbar from "@/app/components/Navbar";
import { redirect } from "next/navigation";
import Footer from "@/app/components/Footer";
import prisma from "@/lib/prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// export const metadata: Metadata = {
//   title: {
//     default: "Integys - Area riservata",
//     template: "%s - Integys",
//   },
//   description:
//     "Integys - Dedicato alle ultime tendenze e approfondimenti nel mondo della tecnologia",
// };

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getServerSession();
  if(!session) {
    redirect("/login-hub");
  }
  const user = await prisma.user.findUnique({
    where: { 
      email: session?.user?.email || "", 
      is_new: false,
      is_deleted: false
    },
  });

  return (
    <div>
      <Navbar shouldChangeColor={!!session} />
      {/* {user 
        ? children
        : <div className="container mx-auto px-4 mt-16 py-20 flex justify-center flex-col items-center gap-8">
            <h1 className="text-center text-3xl font-semibold ">Utente non autorizzato</h1>
            <p>
              L&apos;account è ancora da abilitare, è stato eliminato o non esiste. 
            </p>
            <Link href={`/${params.locale || 'it'}`}> 
              <Button>
                Torna alla home
              </Button>
            </Link>
        </div>
      } */}
      {/* {session 
        ? children
        : <LoginForm />
      } */}
      <Footer />
    </div>
  )
}
