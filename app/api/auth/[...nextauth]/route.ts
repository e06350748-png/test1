import NextAuth, { NextAuthOptions, Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

// عشان TypeScript ما يشتكيش، authOptions مش هيتصدر برا
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
          if (user && (await bcrypt.compare(credentials.password, user.password!))) {
            return user;
          }
          return null;
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),

    // إذا حابب تفعل GitHub أو Google، فك التعليقات وضبط الـ env vars
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    // }),
  ],

  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account | null }) {
      if (account?.provider === "credentials") return true;

      // مثال لإضافة GitHub/Google signup
      // if (account?.provider === "github" || account?.provider === "google") {
      //   try {
      //     const existingUser = await prisma.user.findFirst({
      //       where: { email: user.email! },
      //     });
      //     if (!existingUser) {
      //       await prisma.user.create({
      //         data: { id: nanoid(), email: user.email! },
      //       });
      //     }
      //     return true;
      //   } catch (err) {
      //     console.error("Error saving user:", err);
      //     return false;
      //   }
      // }

      return false;
    },

    async session({ session }) {
      return session;
    },
  },

  session: { strategy: "jwt" },
};

// صدّر فقط الـ handlers المطلوبة للـ HTTP methods
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
