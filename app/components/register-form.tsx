"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { RegistrationSchemaClient, passwordErrorString } from "@/lib/zod/types";
import { useTranslation } from "@/lib/useTranslation";

export default function RegisterForm() {

  const router = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const registrationForm = {
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
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
      body: JSON.stringify(registrationForm),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if(res.ok){
      toast.success(t("register.success_message"));
      router.push("/riservata");
      router.refresh();
    } else {
      toast.error(t("register.error_message"));
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 pt-24 gap-4">
      <h1 className="w-fit font-semibold text-xl">{t("register.page_title")}</h1>
      <form className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4 bg-card rounded-lg p-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-primary font-semibold">{t("register.name_label")}</label>
          <input name="name" id="name" type="text" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="surname" className="text-primary font-semibold">{t("register.surname_label")}</label>
          <input name="surname" id="surname" type="text" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-primary font-semibold">{t("register.email_label")}</label>
          <input name="email" id="email" type="email" className="rounded pl-2" required />
        </div>
        {/* <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-primary font-semibold">Numero di telefono</label>
          <input name="phone" id="phone" type="tel" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-primary font-semibold">Ragione Sociale</label>
          <input name="company" id="company" type="text" className="rounded pl-2" required />
        </div> */}
        <button className="bg-primary text-white px-4 py-2 rounded w-fit self-center mt-8" type="submit" disabled={isLoading}>{t("register.submit_button")}</button>
        <p className="text-center mt-4">
          {t("register.already_registered")} <a href="/login-hub" className="text-primary font-semibold">{t("register.login_link")}</a>
        </p>
      </form>
    </div>
  );
}