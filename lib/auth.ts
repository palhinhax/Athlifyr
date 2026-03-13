import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import type { User, Account, Profile } from "next-auth";

/** Normalize OAuth email and update if casing differs */
async function normalizeOAuthEmail(
  user: User,
  account: Account,
  profile: Profile | undefined
) {
  const emailSource =
    account.provider === "google"
      ? profile?.email
      : (profile?.email ?? user.email);

  if (!emailSource) return;

  const normalizedEmail = emailSource.toLowerCase().trim();

  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });

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

  if (user.email) {
    user.email = normalizedEmail;
  }

  if (existingUser && !user.id) {
    user.id = existingUser.id;
  }
}

/** Sync Google profile picture on sign-in */
async function syncGoogleImage(user: User, profile: Profile | undefined) {
  if (!profile?.picture || !user?.id) return;

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
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
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
      if (account?.provider === "google" || account?.provider === "apple") {
        await normalizeOAuthEmail(user, account, profile);

        if (account.provider === "google") {
          await syncGoogleImage(user, profile);
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
