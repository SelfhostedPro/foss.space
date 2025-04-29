import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { count, eq } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { db } from "@/lib/db";
import { tags, threads } from "@/lib/db/schema";
// Query Keys
export const tagKeys = {
  all: ["tags"] as const,
  byId: (id: string) => ["tags", id] as const,
  byName: (name: string) => ["tags", "name", name] as const,
  withStats: ["tags", "with-stats"] as const,
  byThreadId: (threadId: string) => ["tags", "thread", threadId] as const,
};

// Create Zod schemas from Drizzle schema
const tagSelectSchema = createSelectSchema(tags);
const tagInsertSchema = createInsertSchema(tags, {
  id: z.string().optional(), // ID is auto-generated
  createdAt: z.date().optional(), // Created time is auto-generated
  updatedAt: z.date().optional(), // Updated time is auto-generated
});

// Type definitions based on schemas
export type Tag = z.infer<typeof tagSelectSchema>;
export type TagCreateInput = Omit<
  z.infer<typeof tagInsertSchema>,
  "id" | "createdAt" | "updatedAt"
>;

// Type for tag with thread counts
export type TagWithStats = Tag & {
  threadCount: number;
};

// Server Functions for Tags
export const fetchTags = createServerFn({ method: "GET" }).handler(async () => {
  console.info("Fetching all tags...");
  return await db.query.tags.findMany();
});

export const fetchTagsWithStats = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching tags with stats...");

    // Get all tags
    const tags = await db.query.tags.findMany();

    // For each tag, count threads using this tag
    const tagsWithStats = await Promise.all(
      tags.map(async (tag) => {
        // Count threads with this tag
        const threadCount = await db
          .select({ count: count() })
          .from(threads)
          .where(eq(threads.tagId, tag.id))
          .then((result) => result[0]?.count || 0);

        return {
          ...tag,
          threadCount,
        };
      })
    );

    return tagsWithStats;
  }
);

export const fetchTagById = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    console.info(`Fetching tag with id ${data}...`);
    const tag = await db.query.tags.findFirst({
      where: (tags, { eq }) => eq(tags.id, data),
    });

    if (!tag) {
      throw new Error(`Tag with id ${data} not found`);
    }

    return tag;
  });

export const fetchTagByName = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    console.info(`Fetching tag with slug ${data}...`);
    const tag = await db.query.tags.findFirst({
      where: (tags, { eq }) => eq(tags.name, data),
    });

    if (!tag) {
      throw new Error(`Tag with name ${data} not found`);
    }

    return tag;
  });

export const fetchTagsByThreadId = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: threadId }): Promise<Tag[]> => {
    console.info(`Fetching tags for thread ${threadId}...`);

    // Get all tags associated with this thread
    const result = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.id, threadId),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return result.flatMap((item) => item.tags.map((tag) => tag.tag));
  });

export const createTag = createServerFn({ method: "POST" })
  .validator(
    tagInsertSchema.omit({ id: true, createdAt: true, updatedAt: true })
  )
  .handler(async ({ data }) => {
    console.info("Creating new tag...");
    const now = new Date();
    const id = crypto.randomUUID();

    const result = await db
      .insert(tags)
      .values({
        id,
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0];
  });

// Query Options
export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: tagKeys.all,
    queryFn: () => fetchTags(),
  });

export const tagsWithStatsQueryOptions = () =>
  queryOptions({
    queryKey: tagKeys.withStats,
    queryFn: () => fetchTagsWithStats(),
  });

export const tagByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: tagKeys.byId(id),
    queryFn: () => fetchTagById({ data: id }),
    enabled: !!id,
  });

export const tagsByThreadIdQueryOptions = (threadId: string) =>
  queryOptions({
    queryKey: tagKeys.byThreadId(threadId),
    queryFn: () => fetchTagsByThreadId({ data: threadId }),
    enabled: !!threadId,
  });
export const tagByNameQueryOptions = (name: string) =>
  queryOptions({
    queryKey: tagKeys.byName(name),
    queryFn: () => fetchTagByName({ data: name }),
    enabled: !!name,
  });
