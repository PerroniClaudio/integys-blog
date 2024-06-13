"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {

  const router = useRouter();

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
      toast.error("Credenziali non valide");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 pt-24 gap-4 mt-16">
      <h1 className="w-fit font-semibold text-xl">Accedi</h1>
      <form className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4 bg-input rounded-lg p-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-primary font-semibold">Email</label>
          <input name="email" id="" type="email" className="rounded pl-2" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-primary font-semibold">Password</label>
          <input name="password" type="password" className="rounded pl-2" required />
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded w-fit self-center mt-4" type="submit">Accedi</button>

        <p className="mt-4 w-full text-center">Non sei ancora registrato? <Link href='/register' className="font-semibold text-primary">Registrati</Link></p>
        {/* <Link href='/register' className="bg-primary text-white px-2 py-1 rounded w-fit self-center">Registrati</Link> */}
      </form>
    </div>
  );
}