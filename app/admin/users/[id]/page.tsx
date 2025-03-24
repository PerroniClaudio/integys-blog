import AdminUserContent from '@/app/components/admin/AdminUserContent';
import EditUserForm from '@/app/components/admin/EditUserForm';
import prisma from '@/app/lib/prisma/client';
import { Button } from '@/components/ui/button';
import { PrismaClient } from '@prisma/client';
import { Edit } from 'lucide-react';
import { useParams } from 'next/navigation';



export const dynamic = "force-dynamic";

// Fare tutto l'admin. 
// Controllo permessi (magari aggiungiamo un flag is_admin all'utente), 
// navbar, 
// pagina iniziale, magari con una dashboard, 
// lista utenti
// detttaglio, modifica e disabilitazione utente

// const prisma = new PrismaClient();


export default async function Home({ params }: { params: { id: string } }) {

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <h1 className="col-span-8 text-3xl font-bold">Dettagli utente</h1>
            <hr className="col-span-8 border border-secondary" />

            {/* 
              Modifica informazioni e permessi, disabilitazione utenza, 
              in futuro magari si mette un link esterno per il monitoraggio del singolo utente 
            */}
            <AdminUserContent userId={params.id} />

            {/* <section className="col-span-8">
              <EditUserForm userId={params.id} />
            </section> */}
          </div>
        </div>
      </main>
    </>
  );
}