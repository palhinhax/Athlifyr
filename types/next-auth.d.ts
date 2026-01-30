import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      isProAccount: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    isProAccount: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    isProAccount: boolean;
  }
}
