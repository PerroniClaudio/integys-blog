import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};

export async function POST(request: Request) {
  const { name, email, businessName, requestType, message } =
    await request.json();

  // return new Response(JSON.stringify({ business:business, email:email, field:field, devices:devices, message:message}));

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

  const mailData = {
    from: mailSenderAccount.user,
    to: "info@ifortech.com",
    subject: `Richiesta di contatto da INTEGYS`,
    text: message,
    html: `<div> Nome: ${name} <br/> Email aziendale: ${email} <br/> Azienda: ${businessName} <br/> Richiesta: ${requestType} <br/> Messaggio: <br/> ${message} </div>`,
  };

  const info = await transporter.sendMail(mailData);

  return new Response(
    JSON.stringify([name, email, businessName, requestType, message])
  );
}
