export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import LoginHub from "@/app/components/LoginHub";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ContactUsButton from "@/app/components/ContactUsButton";

export default async function RegisterPage() {

  const session = await getServerSession();

  // Area reiservata disabilitata. Redirect all'homepage
  // redirect("/");

  if(session) {
    redirect("/riservata");
  }

  return (
    <main className="pt-16">
      <Navbar shouldChangeColor={false} />
      {/* <LoginHub /> Non dovrebbe servire se sono solo link */}
      {
        // Rimando al login per l'area riservata
        // Rimando al supporto per la gestione delle richieste
        // Rimando al contattaci
      }    
      {/* Area riservata e Supporto, diviso in due */}
      <div className="m-auto grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-screen p-8 xl:max-w-screen-lg">
        {/* Area riservata */}
        <Card className="px-4 py-8 flex flex-col justify-between items-center gap-8">
          <h2 className="text-2xl font-semibold">Vuoi accedere all'area riservata?</h2>
          <Link href="/login">
            <Button className="font-semibold">
              Vai al login
            </Button>
          </Link>
        </Card>
        {/* Supporto */}
        <Card className="px-4 py-8 flex flex-col justify-between items-center gap-8">
          <h2 className="text-2xl font-semibold">Hai un contratto con noi?</h2>
          <Link href={process.env.SUPPORT_URL!}>
            <Button className="font-semibold">
              Vai al supporto
            </Button>
          </Link>
        </Card>
        {/* Contattaci */}
        <Card className="lg:col-span-2 px-4 py-8 flex flex-col justify-between items-center gap-8">
          <h2 className="text-2xl font-semibold">Vuoi sviluppare un piano d’azione personalizzato?</h2>
          <ContactUsButton className="font-semibold" />
        </Card>
      </div>
    </main>
  );
}