import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials, { CredentialsConfig, CredentialInput } from "next-auth/providers/credentials";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type CredentialsAuthorizeFn = (
  credentials: Record<string, string> | undefined,
  req: any
) => Promise<User | null>;

const credentialsConfig: CredentialsConfig<Record<string, CredentialInput>> = {
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (credentials, req) => {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      return null;
    }
    if (user.password !== credentials.password) {
      return null;
    }
    return {
      ...user,
      id: user.id.toString(), 
    };
  },
  type: "credentials",
  id: ""
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "your-secret-key-goes-here",
  },
  providers: [Credentials(credentialsConfig)],
};

export default NextAuth(authOptions);
