import { seed, reset } from "drizzle-seed";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../../db/schema";
import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".dev.vars" });

async function main() {
  // Create a database connection
  const client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const db = drizzle(client);

  // Reset the database (optional - comment out if you don't want to reset)
  console.log("Resetting database...");
  await reset(db, schema);

  console.log("Seeding database...");

  // Initialize seeding
  await seed(db, schema).refine((f) => ({
    // Users
    user: {
      count: 50,
      columns: {
        id: f.uuid(),
        name: f.fullName(),
        email: f.email(),
        emailVerified: f.boolean(),
        image: f.default({ defaultValue: "https://i.pravatar.cc/300" }),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        updatedAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        role: f.valuesFromArray({ values: ["user", "moderator", "admin"] }),
        banned: f.boolean(),
        banReason: f.string(),
        bio: f.string(),
      },
    },

    // Categories
    categories: {
      count: 15,
      columns: {
        id: f.uuid(),
        name: f.string(),
        description: f.string(),
        slug: f.string(),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        updatedAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Some categories have parent categories
        parentId: f.default({ defaultValue: null }),
      },
      with: {
        threads: [
          { weight: 0.4, count: 1 },
          { weight: 0.3, count: 2 },
          { weight: 0.2, count: 3 },
          { weight: 0.1, count: [4, 5] },
        ],
      },
    },

    // Tags
    tags: {
      count: 30,
      columns: {
        id: f.uuid(),
        name: f.string(),
        slug: f.string(),
        description: f.string(),
        color: f.default({ defaultValue: "#FF5733" }),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        updatedAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
      },
    },

    // Threads
    threads: {
      count: 100,
      columns: {
        id: f.uuid(),
        title: f.string(),
        slug: f.string(),
        isPinned: f.boolean(),
        isLocked: f.boolean(),
        viewCount: f.int({ minValue: 0, maxValue: 10000 }),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        updatedAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys - use first value in the db
        categoryId: f.string(),
        userId: f.string(),
      },
      with: {
        // Generate 1-20 posts for each thread
        posts: [
          { weight: 0.6, count: [1, 2, 3, 4, 5] },
          { weight: 0.3, count: [6, 7, 8, 9, 10] },
          { weight: 0.1, count: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
        ],
        // Add tags to threads
        threadTags: [
          { weight: 0.4, count: 1 },
          { weight: 0.3, count: 2 },
          { weight: 0.2, count: 3 },
          { weight: 0.1, count: [4, 5] },
        ],
        // Add bookmarks to threads
        bookmarks: [
          { weight: 0.7, count: [0, 1] },
          { weight: 0.3, count: [2, 3, 4, 5] },
        ],
      },
    },

    // Posts
    posts: {
      columns: {
        id: f.uuid(),
        content: f.string(),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        updatedAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys handled by relationships
        userId: f.string(),
        threadId: f.string(),
        // Some posts are replies to other posts
        parentId: f.default({ defaultValue: null }),
      },
      with: {
        // Add likes to posts
        likes: [
          { weight: 0.4, count: 0 },
          { weight: 0.3, count: [1, 2] },
          { weight: 0.2, count: [3, 4, 5] },
          { weight: 0.1, count: [6, 7, 8, 9, 10] },
        ],
      },
    },

    // Thread Tags junction table
    threadTags: {
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys handled by relationships
        threadId: f.string(),
        tagId: f.string(),
      },
    },

    // Likes table
    likes: {
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys handled by relationships
        userId: f.string(),
        postId: f.string(),
      },
    },

    // Bookmarks table
    bookmarks: {
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys handled by relationships
        userId: f.string(),
        threadId: f.string(),
      },
    },

    // Tag subscriptions
    tagSubscriptions: {
      count: 50,
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys
        userId: f.string(),
        tagId: f.string(),
      },
    },

    // Thread subscriptions
    threadSubscriptions: {
      count: 80,
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys
        userId: f.string(),
        threadId: f.string(),
      },
    },

    // Category subscriptions
    categorySubscriptions: {
      count: 60,
      columns: {
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys
        userId: f.string(),
        categoryId: f.string(),
      },
    },

    // Notifications
    notifications: {
      count: 200,
      columns: {
        id: f.uuid(),
        type: f.valuesFromArray({
          values: [
            "mention",
            "reply",
            "like",
            "thread_subscription",
            "category_subscription",
          ],
        }),
        message: f.string(),
        resourceId: f.string(),
        resourceType: f.valuesFromArray({
          values: ["post", "thread", "category"],
        }),
        isRead: f.boolean(),
        createdAt: f.date({ minDate: "2023-01-01", maxDate: "2024-07-01" }),
        // Foreign keys
        userId: f.string(),
      },
    },
  }));

  console.log("Database seeding completed!");
}

main().catch(console.error);
