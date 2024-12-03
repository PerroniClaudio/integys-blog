import Link from 'next/link';
import { getServicesData } from '../actions';
import { fullService } from '../lib/interface';
import ServicesComponent from '../components/ServicesComponent';
import ContactUs from "@/components/ui/contact-us";
import ServicesNavigationComponent from '../components/ServicesNavigationComponent';
import NavbarServizi from '../components/NavbarServizi';

export default async function Home() {

  const data: fullService[] = await getServicesData(); 

  return (
    <div className="bg-background">
      <NavbarServizi />
      {/* Hero Section */}
      <section className="relative w-full h-fit mt-16 xl:mt-24 py-12 md:py-24 lg:py-32 xl:py-36  flex items-center justify-center overflow-hidden bg-[url('/servizi/index.png')] bg-cover">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 z-10" /> */}
        <div className="absolute inset-0 bg-primary/60 brightness-50 dark:bg-secondary/60 dark:brightness-100 z-10" />
        <div className="container px-4 relative z-10 flex flex-col gap-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-primary-foreground">
              Servizi Integys
            </h1>
            <p className="text-xl lg:text-2xl font-semibold text-gray-50 mb-8 flex flex-col gap-2">
              <span>Proteggi la tua azienda con soluzioni di sicurezza all&apos;avanguardia.</span>
              <span className='' >Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d’azione Cybersecurity personalizzato.</span>
            </p>

            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci">
                Contattaci
              </Link>
            </div>
          </div>

          {/* <ServicesNavigationComponent services={data} /> */}

        </div>
      </section>

      <ServicesComponent services={data} />
      <ContactUs />
    </div>
  );
}
