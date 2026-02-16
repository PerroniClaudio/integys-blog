import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};
const sendMailTo = process.env.SEND_MAIL_TO;

export async function POST(request: Request) {
  const { name, email, businessName, requestType, message } =
    await request.json();

  // return new Response(JSON.stringify({ business:business, email:email, field:field, devices:devices, message:message}));

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Aggiornato per migliore compatibilità
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
    auth: {
      user: mailSenderAccount.user,
      pass: mailSenderAccount.pass,
    },
    // Timeout più lungo per Office 365
    connectionTimeout: 60000,
    greetingTimeout: 30000,
  });

  const mailData = {
    from: mailSenderAccount.user,
    to: sendMailTo,
    subject: `Richiesta di contatto da INTEGYS NEWS`,
    text: message,
    html: `<div> Nome: ${name} <br/> Email aziendale: ${email} <br/> Azienda: ${businessName} <br/> Richiesta: ${requestType} <br/> Messaggio: <br/> ${message} </div>`,
    headers: {'Content-Type': 'text/html; charset=UTF-8'}
  };

  const info = await transporter.sendMail(mailData);

  const confirmationText = `Gentile ${name},\n\nGrazie per averci contattato. Di seguito il riepilogo della tua richiesta:\n\n Oggetto: ${requestType}\nMessaggio: ${message}\n\nUn nostro consulente ti contatterà al più presto.\n\nCordiali saluti,\nIl team di INTEGYS`;

  const userConfirmMailData = {
    from: mailSenderAccount.user,
    to: email,
    subject: `Riepilogo richiesta di contatto - INTEGYS`,
    text: confirmationText,
    html: `<div> Gentile ${name}, <br/><br/> Grazie per averci contattato. Di seguito il riepilogo della tua richiesta: <br/><br/> Oggetto: ${requestType} <br/> Messaggio: ${message} <br/><br/> Un nostro consulente ti contatterà al più presto. <br/><br/> Cordiali saluti, <br/><br/> Il team di INTEGYS </div>`,
    headers: {'Content-Type': 'text/html; charset=UTF-8'}
  };

  await transporter.sendMail(userConfirmMailData);

  return new Response(
    JSON.stringify([name, email, businessName, requestType, message])
  );
}
