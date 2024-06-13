// 'use client';

import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import prisma from "@/app/lib/prisma/client";
import { z } from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import ValidateForm from "@/app/components/validate-form";
// import ValidateForm from "../../../components/validate-form";

const VerificationSchema = z.object({
  email: z.string().email({ message: "Email non valida" }),
  token: z.string().min(5, { message: "Token non valido" }),
});

export default async function RegisterPage({ params }: { params: { token: string, email: string } }) {

  // const session = await getServerSession();
  // if(session) {
  //   redirect("/riservata");
  // }
  
  // const router = useRouter();
  
  const token = params.token;
  const email= decodeURIComponent(params.email);

  // const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const formData = new FormData(e.currentTarget);

  //   const verificationForm = {
  //     email,
  //     token,
  //   }

  //   const checkResult = VerificationSchema.safeParse(verificationForm);
  //   if(!checkResult.success){
  //     toast.error('Dati non validi')
  //     setIsLoading(false);
  //     // console.log({checkResult})
  //     return;
  //   }
    
  //   const res = await fetch("/api/auth/verify-email", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       email: verificationForm.email,
  //       token: verificationForm.token
  //     }),
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   });

  //   if(res.ok){
  //     if(res.status === 200){
  //       toast.success("Email verificata con successo.");
  //       router.push("/riservata");
  //       router.refresh();
  //     } else if (res.status === 201){
  //       toast.warning("Il link è scaduto. Ti è stata inviata una nuova email di verifica.");
  //     }
  //   } else {
  //     toast.error("Errore dueante la verifica. Se il tempo per la verifica è scaduto ti è stata inviata una nuova email di verifica.");
  //   }
  //   setIsLoading(false);
  // }
  
  return (
    <main className="pt-16">
      <Navbar shouldChangeColor={false} />
      <ValidateForm token={token} email={email} />
    </main>
  );
}