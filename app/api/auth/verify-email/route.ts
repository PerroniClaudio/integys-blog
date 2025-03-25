import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma/client";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { hash } from "bcryptjs";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

const generateToken = () => {
  const token = randomBytes(32).toString("hex");
  return token;
};

const VerificationSchema = z.object({
  email: z.string().email({ message: "Email non valida" }),
  token: z.string().min(5, { message: "Token non valido" }),
  password: z.string().min(8, { message: "Formato password non valido" })
    .max(16, { message: "Formato password non valido" })
    .regex(/[a-z]/, { message: "Formato password non valido" })
    .regex(/[A-Z]/, { message: "Formato password non valido" })
    .regex(/[0-9]/, { message: "Formato password non valido" })
    .regex(/[\W_]/, { message: "Formato password non valido" }),
});

export async function POST(request: Request) {

  try{
    const { token, email, password } = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      auth: {
        user: mailSenderAccount.user,
        pass: mailSenderAccount.pass,
      },
    });

    const verificationForm = {
      email,
      token,
      password
    }

    const checkResult = VerificationSchema.safeParse(verificationForm);
    if(!checkResult.success){
      if(checkResult.error.errors[0].path[0] === 'password'){
        return new NextResponse(JSON.stringify({ error: checkResult.error.errors[0].message }), { status: 400 });
      }
      return new NextResponse(JSON.stringify({ error: 'Dati non validi' }), { status: 400 });
    }

    // Se l'email o il token non esistono restituire un messaggio di errore e reindirizzare alla home
    // controlla che la mail dell'utente esista tra gli utenti registrati e che il campo emailVerified sia null
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if(!user){
      // restituisce un messaggio di errore e reindirizza alla home
      return new NextResponse(JSON.stringify({ error: 'Dati non validi' }), { status: 400 });
    }

    if(user.emailVerified !== null){
      // restituisce email verificata e reindirizza all'area riservata
      return new NextResponse(JSON.stringify({ error: 'Account già attivato', value: user.emailVerified }), { status: 400 });
    }

    // Recupera il token controllando che non sia scaduto e che corrisponda all'utente indicato
    const tokenData = await prisma.verificationToken.findFirst({
      where: {
        user_id: user.id,
        token: token
      }
    });
    // Se il token è valido, aggiorna il campo emailVerified e la password dell'utente
    if(!!tokenData && tokenData.expires >= new Date()){
      const hashedPassword = await hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          password: hashedPassword,
          emailVerified: new Date()
        }
      });

      if (!updatedUser){
        return new NextResponse(JSON.stringify({ error: 'Errore durante la verifica' }), { status: 500 });
      }
      
      return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
    }

    // Crea token e aggiungilo alla tabella 
    const newToken = generateToken();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    await prisma.verificationToken.create({
      data: {
        user_id: user.id,
        token: newToken,
        expires
      }
    });

    // Invia mail per validazione email col link comprendente il token
    const activationLink = `${process.env.NEXTAUTH_URL}/activate-user/${newToken}`;
    // Send email with activationLink to the user's email address

    const message = "Il precedente link di verifica non &egrave; più valido. Di seguito trovi il nuovo link di verifica email per attivare la tua utenza ed impostare la password di accesso: " + activationLink;

    const mailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - Nuovo link di verifica email registrazione`,
      text: message,
      html: `<div> 
        <p>
          Il precedente link di verifica non &egrave; più valido. Di seguito trovi il nuovo link di verifica. <br/> Clicca <a href="${activationLink}">qui</a> per effettuare la verifica email, attivare la tua utenza ed impostare la password di accesso. <br/> 
        </p> <br/>
        <p>
          Se il link non funziona, copia e incolla il seguente URL nel tuo browser: <br/> 
          ${activationLink}
        </p> <br/>
        <p>
          Se non ti sei registrato, ignora questa email.
        </p>
      </div>`,
    };

    const info = await transporter.sendMail(mailData);


    // risponde con success e messaggio informativo
    return new NextResponse(JSON.stringify({message: 'Generato nuovo token di verifica'}), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}