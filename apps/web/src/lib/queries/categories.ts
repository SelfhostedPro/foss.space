import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { categories } from "@/lib/db/schema";
import { threads, posts } from "@/lib/db/schema";
import { z } from "zod";
import { count, eq } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { categoryInsertSchema } from "@/lib/db/schema/categories";
import { db } from "@/lib/db";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  byId: (id: string) => ["categories", id] as const,
  bySlug: (slug: string) => ["categories", "slug", slug] as const,
  withStats: ["categories", "with-stats"] as const,
};

// Server Functions for Categories
export const fetchCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching all categories...");
    return await db.query.categories.findMany();
  }
);

export const fetchCategoriesWithStats = createServerFn({
  method: "GET",
}).handler(async () => {
  console.info("Fetching categories with stats...");

  // Get all categories
  const allCategories = await db.query.categories.findMany();

  // For each category, count threads and posts
  const categoriesWithStats = await Promise.all(
    allCategories.map(async (category) => {
      // Count threads in this category
      const threadCount = await db
        .select({ count: count() })
        .from(threads)
        .where(eq(threads.categoryId, category.id))
        .then((result) => result[0]?.count || 0);

      // Count posts in threads from this category
      const postCount = await db
        .select({ count: count() })
        .from(posts)
        .leftJoin(threads, eq(posts.threadId, threads.id))
        .where(eq(threads.categoryId, category.id))
        .then((result) => result[0]?.count || 0);

      return {
        ...category,
        threadCount,
        postCount,
      };
    })
  );

  return categoriesWithStats;
});

export const fetchCategoryById = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: id }) => {
    console.info(`Fetching category with id ${id}...`);
    const category = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.id, id),
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    return category;
  });

export const fetchCategoryBySlug = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: slug }) => {
    console.info(`Fetching category with slug ${slug}...`);
    const category = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.slug, slug),
    });

    if (!category) {
      throw new Error(`Category with slug ${slug} not found`);
    }

    return category;
  });

export const createCategory = createServerFn({ method: "POST" })
  .validator(
    categoryInsertSchema.omit({ id: true, createdAt: true, updatedAt: true })
  )
  .handler(async ({ data }) => {
    console.info("Creating new category...");
    const now = new Date();
    const id = crypto.randomUUID();

    const result = await db
      .insert(categories)
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
export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: categoryKeys.all,
    queryFn: () => fetchCategories(),
  });

export const categoriesWithStatsQueryOptions = () =>
  queryOptions({
    queryKey: categoryKeys.withStats,
    queryFn: () => fetchCategoriesWithStats(),
  });

export const categoryByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: categoryKeys.byId(id),
    queryFn: () => fetchCategoryById({ data: id }),
    enabled: !!id,
  });

export const categoryBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: () => fetchCategoryBySlug({ data: slug }),
    enabled: !!slug,
  });
