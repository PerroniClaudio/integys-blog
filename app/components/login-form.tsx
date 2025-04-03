"use client";

import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginForm() {

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    // Handle reset password logic here
    try {
      const response = await fetch('/api/auth/request-password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'invio della mail di reset password');
      } else {
        toast.success('Mail di reset password inviata');
      }
    } catch (error: any) {
      console.error(error);
    }
    
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // console.log(formData.get("email"), formData.get("password"));
    const response = await signIn('credentials', {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    console.log({response});
    if(!response?.error) {
      // Se si vuole reindirizzare si può fare qui.
      toast.success("Accesso effettuato");
      router.refresh();
    } else {
      toast.error("Credenziali non valide o account eliminato/non abilitato.");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 pt-24 gap-4 mt-16">
      <h1 className="w-fit font-semibold text-xl">Accedi</h1>
      <form className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4 bg-card rounded-lg p-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-primary font-semibold">Email</label>
          <input name="email" id="" type="email" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-primary font-semibold">Password</label>
          <input name="password" type="password" className="rounded pl-2" required />
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded w-fit self-center mt-4" type="submit">Accedi</button>

        <button
          type="button"
          className="text-primary underline self-center mt-2"
          onClick={() => setIsModalOpen(true)}
        >
          Password dimenticata?
        </button>
        
        <p className="mt-4 w-full text-center">Non sei ancora registrato? <Link href='/register' className="font-semibold text-primary">Registrati</Link></p>
        {/* <Link href='/register' className="bg-primary text-white px-2 py-1 rounded w-fit self-center">Registrati</Link> */}

      </form>

      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsModalOpen(false)} >
            <div className="relative bg-card p-4 rounded-lg" onClick={(e) => e.stopPropagation()} >
              <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
              <form onSubmit={handleResetPassword} className="flex flex-col gap-2">
                <label htmlFor="reset-email" className="text-primary font-semibold">
                  Email
                </label>
                <input name="email" id="reset-email" type="email" className="rounded pl-2" required />
                <div className="flex justify-center gap-2 mt-4">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded" >
                    Conferma
                  </button>
                </div>
                <button type="button" className="text-[16px] absolute top-4 right-4 z-10 bg-gray-300 text-black rounded-sm" onClick={() => setIsModalOpen(false)} >
                  <X className="" />
                </button>
              </form>
            </div>
          </div>
        )}
        
    </div>
  );
}