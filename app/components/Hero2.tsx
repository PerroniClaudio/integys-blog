import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero2() {
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
      <section className="w-full py-4 md:py-8 lg:py-12 xl:py-20 mt-16 relative z-20">
        <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-y-10 max-w-7xl">

          <div className="md:col-span-2 flex flex-col gap-4 md:items-center">
          {/* <div className="flex flex-col space-y-4 text-left"> */}
            <div className="space-y-2">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-primary-foreground md:text-center"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Integys information center
              </h1>
              <p
                className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-300 md:text-center"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Dedicato alle ultime tendenze e approfondimenti nel mondo della
                tecnologia.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                // className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci">
                Contattaci
              </Link>
              <Link
                // className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci">
                Contattaci
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 justify-between text-left md:text-left">
          {/* <div className="flex flex-col gap-4 justify-between text-left md:text-right"> */}
            <div
              // className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary-foreground"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-primary-foreground"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,0.5)",
              }}>
              <span>Scopri i nostri servizi</span>
            </div>
            <p
              className="max-w-[700px] text-gray-100 md:text-xl dark:text-gray-300"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,0.5)",
              }}>
              Frase per la pagina dei servizi.
            </p>
            <div className="space-x-4">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/servizi">
                Vai alla pagina
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 md:text-right">
          {/* <div className="md:col-span-2 flex flex-col gap-4 md:items-center"> */}
            <div
              // className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary-foreground"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-primary-foreground"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,0.5)",
              }}>
              <span>Libreria</span>
            </div>
            <p
              className="max-w-[700px] text-gray-100 md:text-xl dark:text-gray-300"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,0.5)",
              }}>
              Frase area riservata
            </p>
            <div className="space-x-4">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/riservata">
                Area riservata
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
export default Hero2;
