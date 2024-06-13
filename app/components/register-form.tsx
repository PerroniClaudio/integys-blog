"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { RegistrationSchemaClient, passwordErrorString } from "../lib/zod/types";

export default function RegisterForm() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const registrationForm = {
      email: formData.get("email"),
    } 
    const checkResult = RegistrationSchemaClient.safeParse(registrationForm);
    if(!checkResult.success){
      toast.error(checkResult.error.issues[0].message)
      setIsLoading(false);
      console.log({checkResult})
      return;
    }
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: registrationForm.email,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if(res.ok){
      toast.success("Registrazione effettuata con successo. Ti è stata inviata una mail col link di attivazione.");
      router.push("/riservata");
      router.refresh();
    } else {
      toast.error("Errore dueante la registrazione.");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 pt-24 gap-4">
      <h1 className="w-fit font-semibold text-xl">Registrati</h1>
      <form className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4 bg-input rounded-lg p-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-primary font-semibold">Email</label>
          <input name="email" id="email" type="email" className="rounded pl-2" required />
        </div>
        {/* <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-primary font-semibold">Password</label>
          <input name="password" id="password" type="password" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="re-password" className="text-primary font-semibold">Repeat password</label>
          <input name="re-password" id="re-password" type="password" className="rounded pl-2" required />
        </div> */}
        {/* <p className="text-xs">
          {passwordErrorString}
        </p> */}
        <button className="bg-primary text-white px-4 py-2 rounded w-fit self-center mt-8" type="submit" disabled={isLoading}>Registrati</button>
      </form>
    </div>
  );
}