// import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import LoginForm from "@/app/components/login-form";
import Navbar from "@/app/components/Navbar";

// export const metadata: Metadata = {
//   title: {
//     default: "Integys - Area riservata",
//     template: "%s - Integys",
//   },
//   description:
//     "Integys - Dedicato alle ultime tendenze e approfondimenti nel mondo della tecnologia",
// };

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 py-32">
        <Navbar shouldChangeColor={false} />
        {children}
      </main>
      <Footer />
    </div>
  )
}
