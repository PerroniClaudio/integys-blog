"use client";

import { useState, useEffect } from "react";
import Dialog from "./dialog";
import { toast } from "react-toastify";
import { Button } from "./button";
// import { useToast } from "./use-toast";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

interface FormData {
  name: string;
  last_name: string;
  email: string;
}

function NewsletterDialog({isOpen, setIsOpen}: Props) {

  // const {toast} = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    last_name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      const isValidEmail = (email: string): boolean => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
      };
  
      if (!isValidEmail(formData.email)) {
          toast.error("Inserisci un indirizzo email valido")
          return;
      }
  
      const request = fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const response = await request;
      const data = await response.json();
  
      setIsOpen(false);
      toast.success("Iscrizione alla newsletter avvenuta con successo");
      
    }catch(err){
      console.error(err);
      toast.error("Errore durante l'iscrizione alla newsletter") 
    }
  };

  return (
    <section className="">
      <Dialog
        title="Iscriviti alla newsletter!"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-primary">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              placeholder="Mario"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last_name" className="font-semibold text-primary">Cognome</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.last_name}
              onChange={(e) => handleChange(e)}
              placeholder="Rossi"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="business" className="font-semibold text-primary">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              placeholder="mario.rossi@esempio.it"
              required
            />
          </div>

   
          <button
            type="submit"
            // className="bg-neutral-900 hover:bg-neutral-700 w-full p-4 text-primary-400 rounded font-bold">
            className="bg-primary hover:bg-neutral-700 w-full p-4 text-secondary-foreground rounded font-bold text-lg">
            Iscriviti
          </button>

          <p className="italic text-sm">
            I dati personali degli utenti sono raccolti, elaborati e conservati all&apos;interno del servizio Mailjet, una piattaforma di gestione delle email che adotta misure di sicurezza conformi alle normative del Regolamento Generale sulla Protezione dei Dati (GDPR). <br />
            Mailjet garantisce la conformità alle disposizioni del GDPR in merito alla raccolta, all&apos;elaborazione e alla conservazione dei dati personali degli utenti, implementando adeguate misure di sicurezza per proteggere tali dati da accessi non autorizzati, perdite, alterazioni o divulgazioni involontarie.
          </p>
 
        </form>
      </Dialog>
    </section>
  );
}

export default NewsletterDialog;
