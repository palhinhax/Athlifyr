import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isProAccount: user.isProAccount,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Sync Google profile image on every sign-in
      if (account?.provider === "google" && profile?.picture && user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: profile.picture },
        });
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account, profile }) {
      if (user) {
        token.role = user.role as UserRole;
        token.id = user.id;
        // For Google login, fetch isProAccount from database
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isProAccount: true },
          });
          token.isProAccount = dbUser?.isProAccount ?? false;
        } else {
          token.isProAccount = user.isProAccount as boolean;
        }
        // Use Google profile picture if available, otherwise use stored image
        token.picture =
          account?.provider === "google" && profile?.picture
            ? (profile.picture as string)
            : user.image;
      }

      // Update token when session is updated (e.g., profile image changed)
      if (trigger === "update" && session) {
        token.picture = session.user?.image;
        token.name = session.user?.name;
        if (session.user?.isProAccount !== undefined) {
          token.isProAccount = session.user.isProAccount;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.image = token.picture as string | null;
        session.user.isProAccount = token.isProAccount as boolean;
      }
      return session;
    },
  },
});
