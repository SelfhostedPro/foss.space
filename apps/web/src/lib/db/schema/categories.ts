import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// Define categories table with proper typing for self-reference
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  // Self-reference using a separate function to avoid type issues
  parentId: text("parent_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Tags table
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color"), // Hex color code for tag representation
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
