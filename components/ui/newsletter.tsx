import NewsletterButton from "./newsletter-button";

type Props = {};

function Newsletter({}: Props) {

  return (
    <section className="py-8 border-t border-primary">
      <div className="container mx-auto flex flex-col gap-4 justify-between items-center">
        <h2 className="font-bold text-3xl text-center">
            Sei alla ricerca di contenuti esclusivi, aggiornamenti regolari e risorse utili?
        </h2>
        <h3 className="text-center font-semibold text-xl">
            Non perdere l&lsquo;opportunità di ampliare la tua conoscenza!
        </h3>

        <NewsletterButton className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary" />
      </div>
    </section>
  );
}

export default Newsletter;
