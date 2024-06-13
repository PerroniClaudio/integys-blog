// import type { Metadata } from "next";

import { getServerSession } from "next-auth";
import LoginForm from "../components/login-form";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";

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

  return (
    <main>
      <Navbar shouldChangeColor={!!session} />
      {children}
      {/* {session 
        ? children
        : <LoginForm />
      } */}
    </main>
  )
}
