// 'use client';
import Navbar from "../../../components/Navbar";
import { z } from "zod";
import ValidateForm from "@/app/components/validate-form";
// import ValidateForm from "../../../components/validate-form";

const VerificationSchema = z.object({
  email: z.string().email({ message: "Email non valida" }),
  token: z.string().min(5, { message: "Token non valido" }),
});

export default async function RegisterPage({ params }: { params: { token: string, email: string } }) {

  const token = params.token;
  const email= decodeURIComponent(params.email);
  
  return (
    <main className="pt-16">
      <Navbar shouldChangeColor={false} />
      <ValidateForm token={token} email={email} type={"email"} />
    </main>
  );
}