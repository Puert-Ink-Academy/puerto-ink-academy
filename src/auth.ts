import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import { randomInt } from "node:crypto";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { db } from "@/db/index";
import { getUserByEmail, getUserById } from "@/db/queries";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { logger } from "@/lib/logger";
import type { Role } from "@/lib/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      artistName: string | null;
    } & DefaultSession["user"];
  }
}

const parsedPort = Number(process.env.EMAIL_SERVER_PORT ?? "465");
const emailPort = Number.isInteger(parsedPort) ? parsedPort : 465;

const emailServer: SMTPTransport.Options = {
  host: process.env.EMAIL_SERVER_HOST,
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD?.replaceAll(" ", ""),
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function academyAdapter(): Adapter {
  const adapter = DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  });

  return {
    ...adapter,
    async getUserByEmail(email) {
      const row = await getUserByEmail(email.toLowerCase());
      if (!row) return null;

      const user: AdapterUser = {
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        image: row.image,
      };
      return user;
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: academyAdapter(),
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login",
  },
  providers: [
    Nodemailer({
      id: "email",
      name: "Email",
      server: emailServer,
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60,
      generateVerificationToken() {
        return randomInt(100_000, 1_000_000).toString();
      },
      async sendVerificationRequest({ identifier, url, token, provider }) {
        if (!emailServer.host || !provider.from) {
          const error = new Error("Email SMTP is not configured");
          logger.error("auth", error);
          throw error;
        }

        const host = new URL(url).host;
        const transport = createTransport(emailServer);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `${token} is your Puerto Ink Academy code`,
          text: [
            `Your Puerto Ink Academy sign-in code is ${token}.`,
            "It expires in 10 minutes.",
            "",
            `Or open this link: ${url}`,
          ].join("\n"),
          html: [
            "<p>Your Puerto Ink Academy sign-in code is</p>",
            `<p style="font-family:ui-monospace,monospace;font-size:28px;letter-spacing:0.4em">${escapeHtml(token)}</p>`,
            "<p>It expires in 10 minutes.</p>",
            `<p><a href="${escapeHtml(url)}">Sign in to ${escapeHtml(host)}</a></p>`,
          ].join(""),
        });
        const failed = [...(result.rejected ?? []), ...(result.pending ?? [])]
          .map((entry) => (typeof entry === "string" ? entry : entry.address))
          .filter((entry) => entry.length > 0);

        if (failed.length > 0) {
          const error = new Error(`Email (${failed.join(", ")}) could not be sent`);
          logger.error("auth", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const existing = await getUserByEmail(user.email.toLowerCase());
      return existing !== null;
    },
    async session({ session, user }) {
      if (!user.id) return session;

      const row = await getUserById(user.id);
      if (!row) return session;

      session.user = {
        id: row.id,
        role: row.role,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        image: row.image,
        artistName: row.artistName,
      };
      return session;
    },
  },
});
