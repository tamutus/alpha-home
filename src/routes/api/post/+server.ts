import { db, schema } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";

const ADMIN_KEY = process.env.ADMIN_API_KEY;

export async function POST({ request }) {
  const auth = request.headers.get("authorization");

  if (!ADMIN_KEY || auth !== `Bearer ${ADMIN_KEY}`) {
    error(401, "Unauthorized");
  }

  const body = await request.json();
  const { slug, title, description, words, tags } = body;

  if (!slug || !title || !description) {
    error(400, "slug, title, and description are required");
  }

  try {
    const [entry] = await db
      .insert(schema.writings)
      .values({
        slug,
        title,
        description,
        words: Number(words) || 0,
        tags: tags || [],
        published: true,
      })
      .onConflictDoUpdate({
        target: schema.writings.slug,
        set: {
          title,
          description,
          words: Number(words) || 0,
          tags: tags || [],
          updatedAt: new Date(),
        },
      })
      .returning();

    return json({ ok: true, writing: entry });
  } catch (err) {
    console.error("Failed to create writing:", err);
    error(500, "Failed to create writing entry");
  }
}
