import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import LoginForm from "../components/login-form";

export default async function RegisterPage() {

  const session = await getServerSession();
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