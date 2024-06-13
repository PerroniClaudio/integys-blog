import { getServerSession } from "next-auth";
import RegisterForm from "../components/register-form";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";

export default async function RegisterPage() {

  const session = await getServerSession();
  if(session) {
    redirect("/riservata");
  }

  return (
    <main className="pt-16">
      <Navbar shouldChangeColor={false} />
      <RegisterForm />
    </main>
  );
}