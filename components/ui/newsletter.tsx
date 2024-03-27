"use client";

import { useState, useEffect } from "react";
import Dialog from "./dialog";
import { toast } from "react-toastify";

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
    <section className="bg-gradient-to-br from-primary-300 to-neutral-400 p-4 py-16">
      <div className="container mx-auto flex flex-col gap-4 justify-between items-center text-neutral-800">
        <h1 className="text-neutral-900 font-bold text-3xl text-center">
            Sei alla ricerca di contenuti esclusivi, aggiornamenti regolari e risorse utili?
        </h1>
        <h3 className="text-center font-semibold text-xl">
            Non perdere l&lsquo;opportunità di ampliare la tua conoscenza nel settore privacy!
        </h3>

        <button
          className="min-w-1/3 bg-neutral-900 hover:bg-neutral-700 p-4 rounded text-2xl text-neutral-200"
          onClick={() => setIsOpen(true)}>
          Iscriviti alla newsletter
        </button>
      </div>

      <Dialog
        title="Iscriviti alla newsletter!"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Nome</label>
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
            <label htmlFor="last_name">Cognome</label>
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
            <label htmlFor="business">Email</label>
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
            className="bg-neutral-900 hover:bg-neutral-700 w-full p-4 text-primary-400 rounded font-bold">
            Iscriviti
          </button>
        </form>
      </Dialog>
    </section>
  );
}

export default Newsletter;
