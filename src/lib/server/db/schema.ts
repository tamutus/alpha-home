import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const writings = pgTable("writings", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  tags: text("tags").array().notNull().default([]),
  words: integer("words").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  ip: text("ip"),
});
