import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const missing = new Error("DATABASE_URL is not set");
  logger.error("db", missing);
  throw missing;
}

const sslmode = new URL(databaseUrl).searchParams.get("sslmode");
const ssl =
  sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
    ? "require"
    : undefined;

const globalForDb = globalThis as unknown as {
  postgresUrl?: string;
  postgresClient?: ReturnType<typeof postgres>;
};

if (globalForDb.postgresClient && globalForDb.postgresUrl !== databaseUrl) {
  void globalForDb.postgresClient.end({ timeout: 1 });
  globalForDb.postgresClient = undefined;
}

const client =
  globalForDb.postgresClient ??
  postgres(databaseUrl, { max: 10, ...(ssl ? { ssl } : {}) });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresUrl = databaseUrl;
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, {
  schema,
  logger:
    process.env.LOG_DB_QUERIES === "true"
      ? {
          logQuery(query, params) {
            logger.debug("db", `${query} ${JSON.stringify(params)}`);
          },
        }
      : false,
});
