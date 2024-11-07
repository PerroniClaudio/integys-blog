import Link from 'next/link';
import { getServicesData } from '../actions';
import { fullService } from '../lib/interface';
import ServicesComponent from '../components/ServicesComponent';

export default async function Home() {

  const data: fullService[] = await getServicesData(); 

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[url('/servizi/index.png')] bg-cover">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 z-10" /> */}
        <div className="absolute inset-0 bg-primary/70 brightness-50 dark:bg-secondary/80 dark:brightness-100 z-10" />
        <div className="container px-4 mx-auto relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-primary-foreground">
              Servizi Integys
            </h1>
            <p className="text-xl text-gray-100 dark:text-gray-300 mb-8">
              Proteggi la tua azienda con soluzioni di sicurezza all'avanguardia
            </p>

            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci">
                Contattaci
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServicesComponent services={data} />
     
    </div>
  );
}
