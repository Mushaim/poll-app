import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
//import NextAuth from 'next-auth/next';
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';



const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email', placeholder: 'test@test.com' },
        password: { type: 'password', placeholder: 'Pa$$w0rd' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user) return null;

       if(password!==user.password){
        return null
       }

        return user as any;
      },
    }),
  ],
  callbacks: {
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
    jwt({ token, account, user }: { token: any; account: any; user: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = (user).email;
        console.log({ user });
      }
      return token;
    },
  },
  pages: {
    signIn: '/LoginContainer',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
