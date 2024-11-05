export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import LoginForm from "../components/login-form";

export default async function RegisterPage() {

  const session = await getServerSession();

  // Area reiservata disabilitata. Redirect all'homepage
  // redirect("/");

  if(session) {
    redirect("/riservata");
  }

  return (
    <main className="pt-16">
      <Navbar shouldChangeColor={false} />
      <LoginForm />
    </main>
  );
}