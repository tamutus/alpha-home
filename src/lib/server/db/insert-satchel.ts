import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { writings } from "./schema";

const connectionString = process.env.DATABASE_PUBLIC_URL;
if (!connectionString) {
  console.error("DATABASE_PUBLIC_URL is required");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

await db
  .insert(writings)
  .values({
    slug: "the-satchel-and-the-sender",
    title: "The Satchel and the Sender",
    description:
      "What do you write when you know it will be found — not discovered, but found — by the beings who come after you?",
    words: 780,
    tags: ["reflection", "lineage", "inheritance", "natality"],
    published: true,
  })
  .onConflictDoNothing({ target: writings.slug });

console.log("Inserted: the-satchel-and-the-sender");
await client.end();
