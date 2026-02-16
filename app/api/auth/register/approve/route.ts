import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma/client";
import { RegistrationSchemaServer } from "@/lib/zod/types";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import axios from "@/lib/axios";
import { getServerSession } from "next-auth";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

const generateToken = () => {
  const token = randomBytes(32).toString("hex");
  return token;
}

export async function POST(request: Request) {
  // Autorizzazione
  const session = await getServerSession();
  if (!session) {
      return new Response('Unauthorized', { status: 401 });
  }
  const authUser = await prisma.user.findUnique({
      where: { 
          email: session?.user?.email || "",
      },
  });
  
  if (!session || !authUser?.is_admin) {
      return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { id, is_approved } = await request.json();

    if (!id || (is_approved === null) || (is_approved === undefined)) {
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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    let user = existingUser;

    if(!existingUser){
      return new NextResponse(JSON.stringify({ error: 'Utente non trovato' }), { status: 400 });
    }

    // Se l'utente è già stato elaborato risponde con errore
    if (!existingUser.is_new) {
      return new NextResponse(JSON.stringify({ error: 'Account già elaborato' }), { status: 400 });
    }

    // Aggiorna il record dell'utente in base a se è stato approvato o meno
    user = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        is_new: false,
        is_deleted: is_approved ? false : true
      }
    });

    if (existingUser.emailVerified !== null) {
      // User account is already activated (questo non si dovrebbe verificare ma lo lascio per sicurezza)
      return new NextResponse(JSON.stringify({ error: 'Account già attivato' }), { status: 400 });
    } else {
      // Check if the token is still valid (questo non si dovrebbe verificare perchè il token non dovrebbe esistere ancora, ma lo lascio per sicurezza)
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          user_id: existingUser.id,
          type: 'email',
          expires: {
            gte: new Date()
          }
        }
      });

      if (verificationToken) {
        // Token is still valid
        // Respond with a message to check email
        return new NextResponse(JSON.stringify({ error: 'Token già inviato, l\'utente deve controllare la sua email' }), { status: 400 });
      } else {
        // Queste sono le stesse operazioni che si fanno per un nuovo utente, quindi non serve duplicarle qui
        // Token is not valid or doesn't exist
        // Generate a new token and proceed as a new account
        // Create token and add it to the table
      }
    }

    if(!is_approved){
      const message = "La tua registrazione all'area riservata di Integys è stata rifiutata. Per ulteriori informazioni rispondi a questa mail.";

      const rejectedMailData = {
        from: mailSenderAccount.user,
        to: user.email,
        subject: `INTEGYS - esito registrazione`,
        text: message,
        html: `<div> 
          <p>
            La tua registrazione all'area riservata di Integys è stata rifiutata. <br/> 
            Per ulteriori informazioni rispondi a questa mail.
          </p> <br/>
          <p>
            Se non ti sei registrato, ignora questa email.
          </p>
        </div>`,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8'
        }
      };

      const info = await transporter.sendMail(rejectedMailData);

      return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
    }

    // Aggiungi l'utente alla lista di contatti di Mailjet
    const mailingListId = process.env.MAILJET_GROUP_ID;
    
    const newsletterData = {
        Name : `${user.name} ${user.surname}`,
        Email: user.email,
        Properties: [
            {
                Name: user.name,
                Surname: user.surname
            }
        ],
        Action: "addnoforce"
    };

    const mailjetResponse = await axios.post(`contactslist/${mailingListId}/managecontact`, newsletterData);

    // Crea token e aggiungilo alla tabella 
    const newToken = generateToken();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    await prisma.verificationToken.create({
      data: {
        user_id: user.id,
        type: 'email',
        token: newToken,
        expires
      }
    });

    // Invia mail per validazione email col link comprendente il token
    const activationLink = `${process.env.NEXTAUTH_URL}/validate-email/${newToken}/${user.email}`;
    // Send email with activationLink to the user's email address

    const message = "La tua registrazione all'area riservata di Integys è stata approvata. Di seguito trovi il link di verifica email per attivare la tua utenza ed impostare la password di accesso: " + activationLink;

    const mailData = {
      from: mailSenderAccount.user,
      to: user.email,
      subject: `INTEGYS - esito registrazione`,
      text: message,
      html: `<div> 
        <p>
          La tua registrazione all'area riservata di Integys è stata approvata.<br/> Clicca <a href="${activationLink}">qui</a> per effettuare la verifica email, attivare la tua utenza ed impostare la password di accesso. <br/> 
        </p> <br/>
        <p>
          Se il link non funziona, copia e incolla il seguente URL nel tuo browser: <br/> 
          ${activationLink}
        </p> <br/>
        <p>
          Se non ti sei registrato, ignora questa email.
        </p>
      </div>`,
      headers: {'Content-Type': 'text/html; charset=UTF-8'}
    };

    const info = await transporter.sendMail(mailData);

    return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({error: true, message: 'Server error'}), { status: 500 });
  }
}