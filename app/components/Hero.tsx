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
      <div className="absolute inset-0 bg-primary/70 brightness-50 dark:bg-secondary/80 dark:brightness-100 z-10" />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36 mt-16 relative z-20">
        <div className="container px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col gap-8 items-center text-center">
            <div className="space-y-8">
              <h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-foreground"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Integys information center
              </h1>
              <p
                className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-300"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Dedicato alle ultime tendenze e approfondimenti nel mondo della
                tecnologia.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                // className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                className="text-nowrap inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci">
                Contattaci
              </Link>
              {/* <Link
                // className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                className="text-nowrap inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/servizi">
                Scopri i nostri servizi
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Hero;
