"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./button";
import NewsletterDialog from "./newsletter-dialog";
import { twMerge } from "tailwind-merge";
import Dialog from "./dialog";
import { CookiesContext } from "../cookies/cookiesContextProvider";

type Props = {
  className?: string;
};

function NewsletterButton({className}: Props) {

  const[isOpen, setIsOpen] = useState<boolean>(false);

  const {cookiesSettings} = useContext(CookiesContext);

  return (
    <>
      <Button
        variant={"secondary"}
        className={twMerge("text-secondary-foreground text-lg py-4 px-4 min-w-fit text-center bg-primary w-fit", className || "")}
        onClick={() => setIsOpen(true)}
      >
        Iscriviti alla newsletter
      </Button>
      {cookiesSettings && cookiesSettings.all
        ? <NewsletterDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        : <Dialog
            title="Avviso"
            isOpen={isOpen}
            onClose={() => {setIsOpen(false);}}
          >
            <p className="mb-4">
              Per iscriverti alla newsletter invia una mail all&apos;indirizzo <a href="mailto:commerciale@integys.com"><b>commerciale@integys.com</b></a> con oggetto &quot;Iscrizione newsletter Integys&quot;. <br />
            </p>
            <p>
              In alternativa, accettare tutti i cookies e cliccare nuovamente sul bottone &quot;<span className="font-semibold">Iscriviti alla newsletter</span>&quot;<br />
              É possibile modificare le preferenze cookie utilizzando il bottone &quot;<span className="font-semibold">Preferenze cookies</span>&quot; in fondo alla pagina.
            </p>
          </Dialog>
      }
    </>
  );
}

export default NewsletterButton;