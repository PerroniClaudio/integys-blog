// import type { Metadata } from "next";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma/client";
import AdminNavbar from "../components/admin/AdminNavbar";

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
    redirect("/login");
  }

  // Recupera i dati dell'utente dal database
  const user = await prisma.user.findUnique({
    where: { 
      email: session?.user?.email || "",
      is_admin: true,
      is_new: false, 
      is_deleted: false
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="pt-16">
      <AdminNavbar/>
      {/* <Navbar shouldChangeColor={!!session} /> */}
      {children}

      {/* {session 
        ? children
        : <LoginForm />
      } */}
      {/* <Footer /> */}
    </div>
  )
}
