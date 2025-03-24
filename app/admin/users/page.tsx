import AdminUsersSection from "@/app/components/admin/AdminUsersSection";

export const dynamic = "force-dynamic";

// Fare tutto l'admin. 
// Controllo permessi (magari aggiungiamo un flag is_admin all'utente), 
// navbar, 
// pagina iniziale, magari con una dashboard, 
// lista utenti
// dettaglio, modifica e disabilitazione utente

// const prisma = new PrismaClient();


export default async function Home() {

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <h1 className="col-span-8 text-3xl font-bold">Lista utenti</h1>
            <hr className="col-span-8 border border-secondary" />

            <section className="col-span-8">
              <AdminUsersSection />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}