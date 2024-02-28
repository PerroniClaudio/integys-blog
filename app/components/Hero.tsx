import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  return (
    <div
      className="relative"
      style={{
        backgroundImage: "url('/ente.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36 dark:bg-secondary/80 mt-16 bg-primary/70 inset-0 ">
        <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl">
          <div className="flex flex-col space-y-4 text-left">
            <div className="space-y-2">
              <h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-foreground"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Integys
              </h1>
              <p
                className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-400"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Dedicato alle ultime tendenze e approfondimenti nel mondo della
                tecnologia.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="https://integys.com/">
                Scopri di più
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Hero;
