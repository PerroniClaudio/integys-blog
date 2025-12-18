import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma/client";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { hash } from "bcryptjs";
import { headers } from "next/headers";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

const generateToken = () => {
  const token = randomBytes(32).toString("hex");
  return token;
};

const VerificationSchema = z.object({
  id: z.string(),
});

export async function POST(request: Request) {

  try{
    const { id } = await request.json();

    const parsedData = VerificationSchema.safeParse({ id });

    if (!parsedData.success) {
      return new NextResponse(JSON.stringify({ error: parsedData.error.issues }), { status: 400 });
    }

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

    // Se l'email o il token non esistono restituire un messaggio di errore e reindirizzare alla home
    // controlla che la mail dell'utente esista tra gli utenti registrati e che il campo emailVerified sia null
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user){
      // restituisce un messaggio di errore e reindirizza alla home
      return new NextResponse(JSON.stringify({ error: 'Utente non trovato' }), { status: 400 });
    }

    if(user.emailVerified !== null){
      // restituisce email verificata e reindirizza all'area riservata
      return new NextResponse(JSON.stringify({ error: 'Email già verificata', value: user.emailVerified }), { status: 400 });
    }

    // Controlla se c'è già un token valido per l'utente
    const tokenData = await prisma.verificationToken.findFirst({
      where: {
        user_id: user.id,
        type: 'email',
        expires: {
          gt: new Date()
        }
      }
    });

    // Se il token è valido, reinvia lo stesso o lo elimina? se reinvia lo stesso deve inserisre anche la data di scadenza nella mail
    if(!!tokenData){
      await prisma.verificationToken.delete({
        where: {
          token: tokenData.token,
        },
      });
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
    const activationLink = `${process.env.NEXTAUTH_URL}/validate-email/${newToken}/${user.email}`;
    // Send email with activationLink to the user's email address

    const message = "Il precedente link di verifica non è più valido. Di seguito trovi il nuovo link di verifica email per attivare la tua utenza ed impostare la password di accesso: " + activationLink;

    const mailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - Nuovo link di verifica email registrazione`,
      text: message,
      html: `<div> 
        <p>
          Il precedente link di verifica non è più valido. Di seguito trovi il nuovo link di verifica. <br/> Clicca <a href="${activationLink}">qui</a> per effettuare la verifica email, attivare la tua utenza ed impostare la password di accesso. <br/> 
        </p> <br/>
        <p>
          Se il link non funziona, copia e incolla il seguente URL nel tuo browser: <br/> 
          ${activationLink}
        </p> <br/>
        <p>
          Se non ti sei registrato, ignora questa email.
        </p>
      </div>`,
      headers: {'Content-Type': 'text/html', 'charset': 'utf-8'}
    };

    const info = await transporter.sendMail(mailData);


    // risponde con success e messaggio informativo
    return new NextResponse(JSON.stringify({message: 'Generato nuovo token di verifica'
      , link: activationLink, ricreato: `${process.env.NEXTAUTH_URL}/validate-email/${newToken}/${user.email}`, email: user.email


    }), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}