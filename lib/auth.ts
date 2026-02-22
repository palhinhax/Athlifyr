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
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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

        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: (credentials.email as string).toLowerCase().trim(),
              mode: "insensitive",
            },
          },
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
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Normalize email to lowercase to prevent case-sensitive duplicates
        if (profile?.email) {
          const normalizedEmail = profile.email.toLowerCase().trim();

          // Check if a user with this email already exists (case-insensitive)
          const existingUser = await prisma.user.findFirst({
            where: {
              email: {
                equals: normalizedEmail,
                mode: "insensitive",
              },
            },
          });

          // If user exists but with different casing, update to normalized email
          if (
            existingUser &&
            existingUser.email !== normalizedEmail &&
            existingUser.id === user.id
          ) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { email: normalizedEmail },
            });
          }

          // For new users, ensure normalized email is used in account creation
          if (user.email) {
            user.email = normalizedEmail;
          }
          // For existing users, ensure profile has correct ID reference
          if (existingUser && !user.id) {
            user.id = existingUser.id;
          }
        }

        // Sync Google profile image on every sign-in (only if user already exists)
        if (profile?.picture && user?.id) {
          // Check if user exists before updating
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          if (existingUser) {
            await prisma.user.update({
              where: { id: user.id },
              data: { image: profile.picture },
            });
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account, profile }) {
      if (user) {
        token.role = user.role as UserRole;
        token.id = user.id;
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
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
});
