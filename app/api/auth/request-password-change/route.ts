import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma/client";
import { RegistrationSchemaServer } from "@/app/lib/zod/types";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

const generateToken = () => {
  const token = randomBytes(32).toString("hex");
  return token;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if ( !email ) {
      return new NextResponse(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
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

    const checkResult = RegistrationSchemaServer.safeParse({ email });
    if(!checkResult.success){
      // throw new Error(checkResult.error.issues[0].path + ": " + checkResult.error.issues[0].message + ".") ;
      return new NextResponse(JSON.stringify({ error: checkResult.error.issues[0].path + ": " + checkResult.error.issues[0].message + "." }), { status: 400 });
    }

    // Controlla se l'utente esiste
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    // Se l'utente non esiste
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Si è verificato un errore.' }), { status: 400 });
    }
            
    // Se l'utente ha la mail verificata
    if (user.emailVerified !== null) {
      
      let existingToken = await prisma.verificationToken.findFirst({
        where: {
          user_id: user.id,
          type: 'password',
          expires: {
            gte: new Date()
          }
        }
      });

      if(existingToken){
        // Se ha già un token per il reset password attivo si restituisce il messaggio di errore (si può chiedere il reinvio o si rischia di inviare troppe mail?).
        return new NextResponse(JSON.stringify({ error: 'Reset password già richiesto. Controlla la tua email.' }), { status: 400 });
      } 

    } else {
      // Se non ha la mail verificata si controlla se ha un token per l'attivazione email attivo.
      let verificationToken = await prisma.verificationToken.findFirst({
        where: {
          user_id: user.id,
          type: 'email',
          expires: {
            gte: new Date()
          }
        }
      });

      if (verificationToken) {
        // Se ha un token attivo si restituisce il messaggio di errore.
        return new NextResponse(JSON.stringify({ error: 'Devi ancora effettuare la verifica della mail. Controlla la tua email' }), { status: 400 });
      }

    }
    
    // Non ha nessun tipo di token attivo. Si genera e si manda il reset password. nel reset password aggiungiamo anche il controllo della verifica
    const newToken = generateToken();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const passwordResetToken = await prisma.verificationToken.create({
      data: {
        user_id: user.id,
        type: 'password',
        token: newToken,
        expires
      }
    });

    // Invia mail per reset password col link comprendente il token
    const activationLink = `${process.env.NEXTAUTH_URL}/reset-password/${newToken}/${user.email}`;

    const message = "Di seguito trovi il link di reset password: " + activationLink;

    const mailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - Richiesta di reset password`,
      text: message,
      html: `<div> 
        <p>
          Hai richiesto il reset della password per l'area riservata di Integys.<br/> Clicca <a href="${activationLink}">qui</a> per impostare la nuova password di accesso. <br/> 
        </p> <br/>
        <p>
          Se il link non funziona, copia e incolla il seguente URL nel tuo browser: <br/> 
          ${activationLink}
        </p> <br/>
        <p>
          Se non hai richiesto tu il link di reset della password, ignora questa email.
        </p>
      </div>`,
    };

    const info = await transporter.sendMail(mailData);

    // Qui si invia la mail informativa all'amministrazione
    const adminMailData = {
      from: mailSenderAccount.user,
      to: process.env.SEND_MAIL_TO,
      subject: `INTEGYS - Nuova richiesta di resert password`,
      text: `E' stata effettuata una nuova richiesta di resert password per l'area riservata di Integys. Nome: ${user?.name ?? ""}, Email: ${user.email}, Ragione Sociale: ${user?.company ?? ""}.`,
      html: `<div> 
        <p>
          E' stata effettuata una nuova richiesta di resert password per l'area riservata di Integys. <br />
          Nome: ${user?.name ?? ""} <br /> 
          Cognome:  ${user?.surname ?? ""} <br />
          Email: ${user.email} <br /> 
          Ragione Sociale: ${user?.company ?? ""}
        </p> 
      </div>`,
    };

    const adminInfo = await transporter.sendMail(adminMailData);

    // risponde con success e messaggio informativo
    return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}