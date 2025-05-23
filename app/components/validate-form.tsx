"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { ValidationSchemaClient, passwordErrorString } from "../lib/zod/types";

export default function ValidateForm({ email, token, type = "email" }: { email: string, token: string, type: string }) {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const validationForm = {
      email: formData.get("email"),
      password: formData.get("password"),
      rePassword: formData.get("re-password")
    } 
    const checkResult = ValidationSchemaClient.safeParse(validationForm);
    if(!checkResult.success){
      toast.error(checkResult.error.issues[0].message)
      setIsLoading(false);
      console.log({checkResult})
      return;
    }
    
    if(validationForm.password !== validationForm.rePassword){
      toast.error("Le password non corrispondono");
      setIsLoading(false);
      return;
    }

    let res = null;
    if (type === "password"){
      res = await fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          email: validationForm.email,
          password: validationForm.password,
          token: token
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      res = await fetch("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: validationForm.email,
          password: validationForm.password,
          token: token
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    if( res && res.ok){
      if(res.status === 200){
        toast.success(type == "email" ? "Email verificata con successo." : "Password cambiata con successo.");
        router.push("/riservata");
        router.refresh();
      } else if (res.status === 201){
        toast.warning("Il link è scaduto. Ti è stata inviata una nuova email.");
      }
    } else {
      console.log({res})
      toast.error("Errore. Se il tempo è scaduto ti è stata inviata una nuova email.");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 pt-24 gap-4">
      {/* <h1 className="w-fit font-semibold text-xl">Validazione email</h1> */}
      <h1 className="w-fit font-semibold text-xl">
        {type === "email" ? "Validazione email" : "Reset password"}
      </h1>
      <form className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4 bg-card rounded-lg p-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-primary font-semibold">Email</label>
          <input name="email" id="email" type="email" className="rounded pl-2" defaultValue={email} required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-primary font-semibold">Nuova Password</label>
          <input name="password" id="password" type="password" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="re-password" className="text-primary font-semibold">Ripeti password</label>
          <input name="re-password" id="re-password" type="password" className="rounded pl-2" required />
        </div>
        <p className="text-xs">
          {passwordErrorString}
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded w-fit self-center mt-8" type="submit" disabled={isLoading}>Conferma</button>
      </form>
    </div>
  );
}