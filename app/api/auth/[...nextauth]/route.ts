import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from 'bcryptjs';
import prisma from '@/app/lib/prisma/client';
import { LoginSchemaServer } from '@/app/lib/zod/types';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {  
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      // name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        
        // Aggiungere validazione email e password
        const checkCredentials = LoginSchemaServer.safeParse(credentials);
        if(!credentials || !checkCredentials.success){
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            is_new: false,
            is_deleted: false
          }
        });

        if(!user) {
          return null;
        }

        if(await compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email
          }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
}); 

export {handler as GET, handler as POST};