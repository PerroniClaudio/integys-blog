"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./button";
import NewsletterDialog from "./newsletter-dialog";
import { twMerge } from "tailwind-merge";
import Dialog from "./dialog";
import { PreferencesContext } from "../cookies/preferencesProvider";
import UserNotice from "../cookies/UserNotice";
import { useTranslation } from "@/lib/useTranslation";

type Props = {
  className?: string;
};

function NewsletterButton({className}: Props) {

  const[isOpen, setIsOpen] = useState<boolean>(false);
  
  const {userPreferences} = useContext(PreferencesContext);
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant={"secondary"}
        className={twMerge("text-secondary-foreground text-lg py-4 px-4 min-w-fit text-center bg-primary w-fit", className || "")}
        onClick={() => setIsOpen(true)}
      >
        {t("cta.subscribeNewsletter")}
      </Button>
      {userPreferences && userPreferences.all && isOpen
        ? <NewsletterDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        : <Dialog
            title="Avviso"
            isOpen={isOpen}
            onClose={() => {setIsOpen(false);}}
          >
            <p className="mb-4">
              Per iscriverti alla newsletter invia una mail all&apos;indirizzo <a href="mailto:commerciale@integys.com"><b>commerciale@integys.com</b></a> con oggetto &quot;Iscrizione newsletter Integys&quot;. <br />
            </p>
            <p className="mb-4">
              In alternativa, accettare tutti i cookies e cliccare nuovamente sul bottone &quot;<span className="font-semibold">{t("cta.subscribeNewsletter")}</span>&quot;<br />
              É possibile modificare le preferenze cookie utilizzando il bottone sottostante. 
            </p>
            <UserNotice />
          </Dialog>
      }
    </>
  );
}

export default NewsletterButton;