import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
};


export async function GET(request: Request) {
  // const transporter = nodemailer.createTransport({
  //       host: "smtp.office365.com",
  //       port: 587,
  //       secure: false,
  //       tls: {
  //         ciphers: "SSLv3",
  //         rejectUnauthorized: false,
  //       },
  //       auth: {
  //         user: mailSenderAccount.user,
  //         pass: mailSenderAccount.pass,
  //       },
  //     });

  // const message = "Test caratteri: normale è escape &egrave;";

  // const rejectedMailData = {
  //   from: mailSenderAccount.user,
  //   // to: 'g5n2qoz0kd@wywnxa.com',
  //   to: 'e.salsano@ifortech.com',
  //   subject: `INTEGYS -test caratteri`,
  //   text: message,
  //   html: `<div> 
  //     <p>
  //       Test caratteri con utf-8 normale è escape &egrave; 
  //       <div>
  //         <a href="${process.env.NEXTAUTH_URL}/admin/users" target="_blank" >
  //          <button style="padding: 8px 16px; text-decoration: none; color: black; font-weight: 600; background-color: #cc1515; border-radius:8px;">Vai alla lista utenti</button>
  //         </a>
  //       </div>
  //     </p>
  //   </div>`,
  //   headers: {'Content-Type': 'text/html; charset=UTF-8'}
  // };

  // const info = await transporter.sendMail(rejectedMailData);

  return new NextResponse(JSON.stringify({message: 'success'}), { status: 200 });
}