import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
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
  try{
    const { email } = await request.json();

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
        // Respond with appropriate code and message
        return new NextResponse(JSON.stringify({ error: 'Account già attivato' }), { status: 400 });
      } else {
        // Check if the token is still valid
        const verificationToken = await prisma.verificationToken.findFirst({
          where: {
            user_id: existingUser.id,
            expires: {
              gte: new Date()
            }
          }
        });

        if (verificationToken) {
          // Token is still valid
          // Respond with a message to check email
          return new NextResponse(JSON.stringify({ error: 'Token già inviato, controlla la tua email' }), { status: 400 });
        } else {
          // Queste sono le stesse operazioni che si fanno per un nuovo utente, quindi non serve duplicarle qui
          // Token is not valid or doesn't exist
          // Generate a new token and proceed as a new account
          // Create token and add it to the table
        }
      }
    } else {
      const randomString = Math.random().toString(36).substring(2, 12);
      const hashedPassword = await hash( randomString, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });

      user = newUser;
    }

    if(!user){
      return new NextResponse(JSON.stringify({ error: 'Errore durante la creazione dell\'utente' }), { status: 500 });
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

    const message = "Ti sei registrato all'area riservata di Integys. Di seguito trovi il link di verifica email per attivare la tua utenza ed impostare la password di accesso: " + activationLink;

    const mailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - Verifica email registrazione`,
      text: message,
      html: `<div> 
        <p>
          Ti sei registrato all'area riservata di Integys.<br/> Clicca <a href="${activationLink}">qui</a> per effettuare la verifica email, attivare la tua utenza ed impostare la password di accesso. <br/> 
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
    return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}