import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { threads, tags, tagsRelations, threadTags } from "@/lib/db/schema";
import { and, eq, asc, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { Category } from "@/lib/db/schema/categories";
import type { SessionUser } from "./users";
import type { Tag } from "./tags";

// Query Keys
export const threadKeys = {
  all: ["threads"] as const,
  byId: (id: string) => ["threads", id] as const,
  bySlug: (slug: string) => ["threads", "slug", slug] as const,
  byCategoryId: (categoryId: string) =>
    ["threads", "category", categoryId] as const,
  byTagId: (tagId: string) => ["threads", "tag", tagId] as const,
};

// Create Zod schemas from Drizzle schema
const threadSelectSchema = createSelectSchema(threads);
const threadInsertSchema = createInsertSchema(threads, {
  slug: z.string().optional(), // Allow slug to be automatically generated
  viewCount: z.number().default(0),
});
const threadUpdateSchema = createUpdateSchema(threads).extend({
  id: z.string().uuid(),
});

// Type definitions based on schemas
export type Thread = z.infer<typeof threadSelectSchema>;
export type ThreadWithRelations = Thread & {
  category: Category;
  author: SessionUser;
  tags: Tag[];
};
export type ThreadCreateInput = Omit<
  z.infer<typeof threadInsertSchema>,
  "id" | "createdAt" | "updatedAt" | "viewCount"
>;
export type ThreadUpdateInput = z.infer<typeof threadUpdateSchema>;

// Extended create input with tag IDs
export type CreateThreadInput = {
  data: ThreadCreateInput;
  tagIds?: string[];
};

// Server Functions for Threads
export const fetchThreads = createServerFn({ method: "GET" }).handler(
  async (): Promise<ThreadWithRelations[]> => {
    console.info("Fetching all threads...");
    const threads = await db.query.threads.findMany({
      with: {
        category: true,
        author: true,
        tags: {
          with: { tag: true },
        },
      },
      orderBy: (threads, { desc }) => [desc(threads.createdAt)],
    });
    const tags = threads.map((thread) => thread.tags.map((tag) => tag.tag));
    return threads.map((thread) => ({
      ...thread,
      tags: tags.flat(),
    }));
  }
);

export const fetchThreadsByCategory = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: categoryId }) => {
    console.info(`Fetching threads for category ${categoryId}...`);
    const threads = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.categoryId, categoryId),
      with: {
        category: true,
        author: true,
        tags: {
          with: { tag: true },
        },
      },
      orderBy: (threads, { desc }) => [desc(threads.createdAt)],
    });
    const tags = threads.map((thread) => thread.tags.map((tag) => tag.tag));
    return threads.map((thread) => ({
      ...thread,
      tags: tags.flat(),
    }));
  });

export const fetchThreadsByTag = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: tagId }): Promise<ThreadWithRelations[]> => {
    console.info(`Fetching threads with tag ${tagId}...`);

    const threads = await db.query.threadTags.findMany({
      where: (tags, { eq }) => eq(tags.tagId, tagId),
      with: {
        thread: {
          with: {
            category: true,
            author: true,
            tags: {
              with: { tag: true },
            },
          },
        },
      },
    });

    const tags = threads.map((thread) =>
      thread.thread.tags.map((tag) => tag.tag)
    );

    return threads.map((thread) => ({
      ...thread.thread,
      tags: tags.flat(),
    }));
  });

export const fetchThreadById = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: id }) => {
    console.info(`Fetching thread with id ${id}...`);
    const thread = await db.query.threads.findFirst({
      where: (threads, { eq }) => eq(threads.id, id),
      with: {
        category: true,
        author: true,
        tags: true,
        posts: {
          with: {
            author: true,
          },
          orderBy: (posts, { asc }) => [asc(posts.createdAt)],
        },
      },
    });

    if (!thread) {
      throw new Error(`Thread with id ${id} not found`);
    }

    return thread;
  });

export const fetchThreadBySlug = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: slug }) => {
    console.info(`Fetching thread with slug ${slug}...`);
    const thread = await db.query.threads.findFirst({
      where: (threads, { eq }) => eq(threads.slug, slug),
      with: {
        category: true,
        author: true,
        tags: true,
        posts: {
          with: {
            author: true,
          },
          orderBy: (posts, { asc }) => [asc(posts.createdAt)],
        },
      },
    });

    if (!thread) {
      throw new Error(`Thread with slug ${slug} not found`);
    }

    // Increment view count
    await db
      .update(threads)
      .set({
        viewCount: (thread.viewCount || 0) + 1,
        updatedAt: thread.updatedAt, // Keep same updated time as view count doesn't count as update
      })
      .where(eq(threads.id, thread.id));

    return {
      ...thread,
      viewCount: (thread.viewCount || 0) + 1, // Return updated view count
    };
  });

export const createThread = createServerFn({ method: "POST" })
  .validator(
    z.object({
      data: threadInsertSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        viewCount: true,
      }),
      tagIds: z.array(z.string()).optional(),
    })
  )
  .handler(async ({ data: { data, tagIds } }) => {
    console.info("Creating new thread...");
    const now = new Date();
    const id = crypto.randomUUID();

    // Generate slug if not provided
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

    const result = await db
      .insert(threads)
      .values({
        id,
        ...data,
        slug,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // If tag IDs are provided, create the thread-tag relationships
    if (tagIds && tagIds.length > 0) {
      await db.insert(threadTags).values(
        tagIds.map((tagId) => ({
          threadId: id,
          tagId,
        }))
      );
    }

    return result[0];
  });

export const updateThread = createServerFn({ method: "POST" })
  .validator(threadUpdateSchema)
  .handler(async ({ data: { id, ...data } }) => {
    console.info(`Updating thread with id ${id}...`);

    // Check if thread exists
    const existingThread = await db.query.threads.findFirst({
      where: (threads, { eq }) => eq(threads.id, id),
    });

    if (!existingThread) {
      throw new Error(`Thread with id ${id} not found`);
    }

    // Update thread
    const updatedAt = new Date();
    const result = await db
      .update(threads)
      .set({
        ...data,
        updatedAt,
      })
      .where(eq(threads.id, id))
      .returning();

    return result[0];
  });

export const addThreadTag = createServerFn({ method: "POST" })
  .validator(
    z.object({
      threadId: z.string(),
      tagId: z.string(),
    })
  )
  .handler(async ({ data: { threadId, tagId } }) => {
    console.info(`Adding tag ${tagId} to thread ${threadId}...`);

    // First check if the tag exists
    const existingTag = await db.query.tags.findFirst({
      where: (tags, { eq }) => eq(tags.id, tagId),
    });

    if (!existingTag) {
      // Create the tag if it doesn't exist
      const now = new Date();
      await db.insert(tags).values({
        id: tagId,
        name: tagId,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Then connect the tag to the thread
    // This uses Drizzle's relations system
    // The exact implementation depends on how your schema defines the relationship
    const threadToTag = await db
      .insert(threadTags)
      .values({
        threadId,
        tagId,
      })
      .returning();

    return threadToTag;
  });

export const removeThreadTag = createServerFn({ method: "POST" })
  .validator(
    z.object({
      threadId: z.string(),
      tagId: z.string(),
    })
  )
  .handler(async ({ data: { threadId, tagId } }) => {
    console.info(`Removing tag ${tagId} from thread ${threadId}...`);

    // Remove the relationship between thread and tag
    return await db
      .delete(threadTags)
      .where(
        and(eq(threadTags.threadId, threadId), eq(threadTags.tagId, tagId))
      )
      .returning();
  });

// Query Options
export const threadsQueryOptions = () =>
  queryOptions({
    queryKey: threadKeys.all,
    queryFn: () => fetchThreads(),
  });

export const threadsByCategoryQueryOptions = (categoryId: string) =>
  queryOptions({
    queryKey: threadKeys.byCategoryId(categoryId),
    queryFn: () => fetchThreadsByCategory({ data: categoryId }),
    enabled: !!categoryId,
  });

export const threadsByTagQueryOptions = (tagId: string) =>
  queryOptions({
    queryKey: threadKeys.byTagId(tagId),
    queryFn: () => fetchThreadsByTag({ data: tagId }),
    enabled: !!tagId,
  });

export const threadByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: threadKeys.byId(id),
    queryFn: () => fetchThreadById({ data: id }),
    enabled: !!id,
  });

export const threadBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: threadKeys.bySlug(slug),
    queryFn: () => fetchThreadBySlug({ data: slug }),
    enabled: !!slug,
  });

// Mutation Options
export const useCreateThreadMutation = () => ({
  mutationFn: (input: CreateThreadInput) => createThread({ data: input }),
  onSuccess: (_data: Thread) => {
    // Invalidate affected queries
    return [{ queryKey: threadKeys.all }];
  },
});

export const useUpdateThreadMutation = () => ({
  mutationFn: (input: ThreadUpdateInput) => updateThread({ data: input }),
  onSuccess: (_data: Thread, variables: ThreadUpdateInput) => {
    // Invalidate affected queries
    return [
      { queryKey: threadKeys.all },
      { queryKey: threadKeys.byId(variables.id) },
    ];
  },
});

export const useAddThreadTagMutation = () => ({
  mutationFn: (input: { threadId: string; tagId: string }) =>
    addThreadTag({ data: input }),
  onSuccess: (
    _data: unknown,
    variables: { threadId: string; tagId: string }
  ) => {
    // Invalidate affected queries
    return [
      { queryKey: threadKeys.byId(variables.threadId) },
      { queryKey: threadKeys.byTagId(variables.tagId) },
    ];
  },
});

export const useRemoveThreadTagMutation = () => ({
  mutationFn: (input: { threadId: string; tagId: string }) =>
    removeThreadTag({ data: input }),
  onSuccess: (
    _data: unknown,
    variables: { threadId: string; tagId: string }
  ) => {
    // Invalidate affected queries
    return [
      { queryKey: threadKeys.byId(variables.threadId) },
      { queryKey: threadKeys.byTagId(variables.tagId) },
    ];
  },
});
