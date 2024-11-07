import { z } from "zod";

export const passwordErrorString = "La password deve contenere tra gli 8 e i 16 caratteri, includendo almeno una lettera minuscola, una lettera maiuscola, un numero e un carattere speciale."

export const RegistrationSchemaClient = z.object({
  name: z.string().min(1, { message: "Nome non valido" }),
  surname: z.string().min(1, { message: "Cognome non valido" }),
  email: z.string().email({ message: "Email non valida" }),
  phone: z.string().min(1, { message: "Numero di telefono non valido" }),
  company: z.string().min(1, { message: "Nome azienda non valido" }),
});

export const RegistrationSchemaServer = z.object({
  email: z.string().email({ message: "Email non valida" }),
});
  
export const ValidationSchemaClient = z.object({
  email: z.string().email({ message: "Email non valida" }),
  password: z.string().min(8, { message: passwordErrorString })
    .max(16, { message: passwordErrorString })
    .regex(/[a-z]/, { message: passwordErrorString })
    .regex(/[A-Z]/, { message: passwordErrorString })
    .regex(/[0-9]/, { message: passwordErrorString })
    .regex(/[\W_]/, { message: passwordErrorString }),
});

export const LoginSchemaServer = z.object({
  email: z.string().email({ message: "Email o password mancante" }),
  password: z.string().min(1, { message: "Email o password mancante" }),
});