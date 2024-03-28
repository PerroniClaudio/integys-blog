"use client";

import { useState, useEffect } from "react";
import Dialog from "./dialog";
import { toast } from "react-toastify";
import { Button } from "./button";

type Props = {};

interface FormData {
  name: string;
  last_name: string;
  email: string;
}

function Newsletter({}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!isValidEmail(formData.email)) {
        toast.error("Inserisci una mail valida!");
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
    toast.success("Iscrizione avvenuta con successo!");
  };

  return (
    <section className="py-8 border-t border-primary">
      <div className="container mx-auto flex flex-col gap-4 justify-between items-center">
        <h1 className="font-bold text-3xl text-center">
            Sei alla ricerca di contenuti esclusivi, aggiornamenti regolari e risorse utili?
        </h1>
        <h3 className="text-center font-semibold text-xl">
            Non perdere l&lsquo;opportunità di ampliare la tua conoscenza!
        </h3>

        {/* <button
          // className="min-w-1/3 bg-primary hover:bg-neutral-700 p-4 rounded text-2xl text-neutral-200"
          className="text-secondary-foreground text-lg py-4 px-16 min-w-16 text-center bg-primary rounded font-semibold "
          onClick={() => setIsOpen(true)}>
          Iscriviti alla newsletter
        </button> */}
        <Button
          variant={"secondary"}
          onClick={() => setIsOpen(true)}
          className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary">
          Iscriviti alla newsletter
        </Button>
      </div>

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
              placeholder="mario.rossi@comune.it"
              required
            />
          </div>
 
          <button
            type="submit"
            // className="bg-neutral-900 hover:bg-neutral-700 w-full p-4 text-primary-400 rounded font-bold">
            className="bg-primary hover:bg-neutral-700 w-full p-4 text-secondary-foreground rounded font-bold text-lg">
            Iscriviti
          </button>
        </form>
      </Dialog>
    </section>
  );
}

export default Newsletter;
