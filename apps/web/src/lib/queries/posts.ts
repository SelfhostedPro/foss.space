import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { posts } from "../db/schema";
import { createInsertSchema } from "drizzle-zod";

// Schemas
const postCreateSchema = createInsertSchema(posts).omit({});

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  byId: (id: string) => ["posts", id] as const,
  byThreadId: (threadId: string) => ["posts", "thread", threadId] as const,
};

// Server Functions for Posts
export const fetchPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching all posts...");
    return await db.query.posts.findMany({
      with: {
        author: true,
        thread: true,
      },
    });
  }
);

export const fetchPostsByThreadId = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: threadId }) => {
    console.info(`Fetching posts for thread ${threadId}...`);
    return await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.threadId, threadId),
      with: {
        author: true,
        thread: true,
      },
    });
  });

export const fetchPostById = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: id }) => {
    console.info(`Fetching post with id ${id}...`);
    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
      with: {
        author: true,
        thread: true,
      },
    });

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    return post;
  });

export const createPost = createServerFn({ method: "POST" })
  .validator(
    postCreateSchema.omit({ id: true, createdAt: true, updatedAt: true })
  )
  .handler(async ({ data }) => {
    console.info("Creating new post...");
    const now = new Date();
    const id = crypto.randomUUID();

    const result = await db
      .insert(posts)
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
export const postsQueryOptions = () =>
  queryOptions({
    queryKey: postKeys.all,
    queryFn: () => fetchPosts(),
  });

export const postsByThreadIdQueryOptions = (threadId: string) =>
  queryOptions({
    queryKey: postKeys.byThreadId(threadId),
    queryFn: () => fetchPostsByThreadId({ data: threadId }),
    enabled: !!threadId,
  });

export const postByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: postKeys.byId(id),
    queryFn: () => fetchPostById({ data: id }),
    enabled: !!id,
  });
