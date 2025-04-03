import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowRightIcon, ChartLine, ExternalLink, FilePenLine, Newspaper, Send, UserRoundSearch } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Fare tutto l'admin. 
// Controllo permessi (magari aggiungiamo un flag is_admin all'utente), 
// navbar, 
// pagina iniziale, magari con una dashboard, 
// lista utenti
// detttaglio, modifica e disabilitazione utente

export default async function Home() {

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <hr className="col-span-8 border border-secondary" />

            {/* Reindirizzamenti */}
            <section className="col-span-8 grid grid-cols-2 gap-4">
              <Link href="/admin/users">
                <Button className="relative flex-col space-y-4 w-full min-h-fit py-8 items-center pt-6 rounded-lg border-2">
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    Utenti
                  </h3>
                  <div className="w-fit m-auto mt-8">
                    <UserRoundSearch size={100} strokeWidth={1.5} />
                  </div>
                  <div className="absolute right-4 top-4">
                    <ArrowRight size={34} />
                  </div>
                </Button>
              </Link>
              <Link href={'/admin/article-list'} target="_blank">
                <Button className="relative flex-col space-y-4 w-full min-h-fit py-8 items-center pt-6 rounded-lg border-2">
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    Anteprima articoli
                  </h3>
                  <div className="w-fit m-auto mt-8">
                    <Newspaper size={100} strokeWidth={1.5} />
                  </div>
                  <div className="absolute right-4 top-4">
                    <ArrowRight size={34} />
                  </div>
                </Button>
              </Link>
              <Link href={process.env.SANITY_PUBLIC_SITE_URL ?? '#'} target="_blank">
                <Button className="relative flex-col space-y-4 w-full min-h-fit py-8 items-center pt-6 rounded-lg border-2">
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    Modifica contenuti
                  </h3>
                  <div className="w-fit m-auto mt-8">
                    <FilePenLine size={100} strokeWidth={1.5} />
                  </div>
                  <div className="absolute right-4 top-4">
                    <ExternalLink size={34} />
                  </div>
                </Button>
              </Link>
              <Link href={process.env.MONITORING_URL ?? '#'} target="_blank">
                <Button className="relative flex-col space-y-4 w-full min-h-fit py-8 items-center pt-6 rounded-lg border-2">
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    Monitoraggio
                  </h3>
                  <div className="w-fit m-auto mt-8">
                    <ChartLine size={100} strokeWidth={1.5} />
                  </div>
                  <div className="absolute right-4 top-4">
                    <ExternalLink size={34} />
                  </div>
                </Button>
              </Link>
              <Link href={process.env.CAMPAIGN_URL ?? '#'} target="_blank">
                <Button className="relative flex-col space-y-4 w-full min-h-fit py-8 items-center pt-6 rounded-lg border-2">
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    Campagne
                  </h3>
                  <div className="w-fit m-auto mt-8">
                    <Send size={100} strokeWidth={1.5} />
                  </div>
                  <div className="absolute right-4 top-4">
                    <ExternalLink size={34} />
                  </div>
                </Button>
              </Link>
            </section>


          </div>
        </div>
      </main>
    </>
  );
}