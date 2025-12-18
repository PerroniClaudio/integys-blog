import prisma from "@/app/lib/prisma/client";
import { client } from "@/app/lib/sanity";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

type blogData = {
  limited: boolean;
}
export async function GET(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;

  if(!ref){
    return new Response("Missing ref parameter", { status: 404 });
  }

  try {

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

    const query = `
        *[_type == 'blog' && references("${ref}")]{
          limited
        }
      `;
  
    const data : blogData[] = await client.fetch(query);
  
    const session = await getServerSession();

    if (!data.find(post => post.limited == false)){
      // controlla se l'utente è loggato. 
  
      // Se non è loggato restituisci errore.
      if(!session){
        return new Response("Unauthorized", { status: 403 });
      }
    } 

    let user = null;
    if (session && !!session?.user?.email) {
      user = await prisma.user.findUnique({
        where: {
          email: session.user.email
        }
      });
    }
  
    // Qui o l'utente è loggato o il file è pubblico. Quindi si può inviare

    // Per prendere il titolo del file devo partire dal blog e poi prendere il file 
    // (perchè il titolo del file fa parte del modello del blog e non dell'asset)
    // Quindi si dovrà aggiornare questa parte nel caso si decidesse di creare una sezione file separata dagli articoli
    const fileQuery = `
      *[_type == 'blog' && references("${ref}")]{
        "file": files[asset->_id == "${ref}"]{
          _key,
          "extension": asset->extension,
          "assetId": asset->_id,
          "title": coalesce(title, "file-integys"),
          "url": asset->url
        }[0]
      }[0].file
    `;
  
    const fileData = await client.fetch(fileQuery);
  
    if (!fileData) {
      return new Response("File not found", { status: 404 });
    }
  
    const fileUrl = fileData.url;
  
    const fileResponse = await fetch(fileUrl);
  
    if (!fileResponse.ok) {
      return new Response("Error downloading file", { status: 500 });
    }
  
    const fileBlob = await fileResponse.blob();
  

    // Qui si invia la mail informativa all'amministrazione

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || req.headers.get('fastly-client-ip') || req.headers.get('true-client-ip') || req.headers.get('x-cluster-client-ip') || req.headers.get('x-forwarded') || req.headers.get('forwarded-for') || req.headers.get('forwarded');

    const userInfo = user ? `
      Nome: ${user.name ?? ""},
      Cognome: ${user.surname ?? ""},
      Email: ${user.email},
      Telefono: ${user.phone ?? ""},
      Ragione Sociale: ${user.company ?? ""}
    ` : ('Utente non loggato. IP: ' + ip);

    const message = `Un utente ha scaricato un file da Integys. 
      ${userInfo}
      File scaricato: ${fileData.title}
      Riferimento file: ${fileData.assetId}
    `;
    
    const adminMailData = {
      from: mailSenderAccount.user,
      to: process.env.SEND_MAIL_TO,
      subject: `INTEGYS - Download file`,
      text: message,
      html: `<div>${message.replace(/\n/g, '<br>')}</div>`,
      headers: {'Content-Type': 'text/html; charset=UTF-8'}
    };

    const adminInfo = await transporter.sendMail(adminMailData);
    const sanitizedTitle = fileData.title.replace(/\s+/g, '-');
    return new Response(fileBlob, {
      headers: {
        "Content-Type": fileResponse.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${sanitizedTitle}.${fileData.extension}"`,
        "X-File-Name": `${sanitizedTitle}.${fileData.extension}`
      }
    });


  } catch (error : any) {
    return new Response (error);
  }

    
}
