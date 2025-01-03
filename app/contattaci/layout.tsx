// import type { Metadata } from "next";
import Footer from "../components/Footer";
import LoginForm from "../components/login-form";
import Navbar from "../components/Navbar";

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
    <div className="pb-44">
      <main className="max-w-7xl mx-auto px-4 py-32">
        <Navbar shouldChangeColor={false} />
        {children}
      </main>
      <Footer />
    </div>
  )
}
