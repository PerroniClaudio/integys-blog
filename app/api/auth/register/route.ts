import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/app/lib/prisma/client";
import { RegistrationSchemaServer } from "@/app/lib/zod/types";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import axios from "@/app/lib/axios";

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
    const { name, surname, email } = await request.json();

    if (!name || !surname || !email ) {
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

    // Controlla se la mail esiste già tra gli utenti registrati

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    let user = existingUser;

    if (existingUser) {
      if (existingUser.emailVerified !== null) {
        // User account is already activated
        return new NextResponse(JSON.stringify({ error: 'Account già attivato' }), { status: 400 });
      } else {
        // User account is not approved yet
        if(existingUser.is_new){
          return new NextResponse(JSON.stringify({ error: 'Registrazione già richiesta. Account in attesa di approvazione.' }), { status: 400 });
        }
      }
    } else {
      const randomString = Math.random().toString(36).substring(2, 12);
      const hashedPassword = await hash( randomString, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          surname,
          email,
          password: hashedPassword
        }
      });

      user = newUser;
    }

    if(!user){
      return new NextResponse(JSON.stringify({ error: 'Errore durante la creazione dell\'utente' }), { status: 500 });
    }

    // prima di fare tutto il resto bisogna controllare di persona i dati dell'utente (lato admin). Poi si possono fare le operazioni successive.

    const userMailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - Richiesta di registrazione`,
      text: `La tua richiesta di registrazione all'area riservata di Integys &egrave; in elaborazione. 
        Per completare la registrazione attendi la mail con l'esito della richiesta e le istruzioni per l'attivazione. 
        Se non ti sei registrato, ignora questa email.
      `,
      html: `<div> 
        <p>
          La tua richiesta di registrazione all'area riservata di Integys &egrave; in elaborazione. <br />
          Per completare la registrazione attendi la mail con l'esito della richiesta e le istruzioni per l'attivazione. <br />
          Se non ti sei registrato, ignora questa email.
        </p> 
      </div>`,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }
    };

    const userInfo = await transporter.sendMail(userMailData);
    
    // Qui si invia la mail informativa all'amministrazione
    
    const adminMailData = {
      from: mailSenderAccount.user,
      to: process.env.SEND_MAIL_TO,
      subject: `INTEGYS - Nuova registrazione utente`,
      text: `E' stata effettuata una nuova registrazione all'area riservata di Integys. Nome: ${user?.name ?? ""},  Cognome: ${user?.surname ?? ""}, Email: ${user.email}}.`,
      html: `<div> 
        <p>
          E' stata effettuata una nuova registrazione all'area riservata di Integys. <br />
          Nome: ${user?.name ?? ""} <br /> 
          Cognome: ${user?.surname ?? ""} <br /> 
          Email: ${user.email} <br /> 
        </p> 
        <div>
          <a href="${process.env.NEXTAUTH_URL}/admin/users" target="_blank" >
           <button>Vai alla lista utenti</button>
          </a>
        </div>
      </div>`,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }
    };

    const adminInfo = await transporter.sendMail(adminMailData);

    // risponde con success e messaggio informativo
    return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({error: true, message: 'Server error'}), { status: 500 });
  }
}