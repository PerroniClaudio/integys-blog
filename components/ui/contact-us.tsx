import Link from "next/link";
import NewsletterButton from "./newsletter-button";
import { Button } from "./button";

type Props = {};

function ContactUs({}: Props) {

  return (
    <section className="py-8 border-t border-primary">
      <div className="container mx-auto flex flex-col gap-4 justify-between items-center">
        <h2 className="font-bold text-3xl text-center">
          Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d’azione Cybersecurity personalizzato.
        </h2>
        <Link href="/contattaci" className="justify-self-start">
          <Button
            variant={"secondary"}
            className="text-secondary-foreground text-lg py-6 px-10 min-w-16 text-center bg-primary w-full">
            Contattaci
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default ContactUs;
