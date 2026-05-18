import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_PUBLIC_URL!;

// Prevent multiple instances during hot reload
const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> | undefined };

if (!globalForDb.db) {
  const client = postgres(connectionString, { prepare: false });
  globalForDb.db = drizzle(client, { schema });
}

export const db = globalForDb.db;
export { schema };
