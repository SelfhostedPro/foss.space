import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { user } from "@/lib/db/schema";
import { z } from "zod";
import { db } from "@/lib/db/db.server";
import { eq } from "drizzle-orm";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  byId: (id: string) => ["users", id] as const,
  byEmail: (email: string) => ["users", "email", email] as const,
};

// Server Functions for Users
export const fetchUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching all users...");
    return await db().query.user.findMany();
  }
);

export const fetchUserById = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const user = await db().query.user.findFirst({
      where: (user, { eq }) => eq(user.id, data),
      columns: {
        email: false,
        banned: false,
        banReason: false,
        banExpires: false,
        emailVerified: false,
      },
    });

    if (!user) {
      throw new Error(`User with id ${data} not found`);
    }
    return user;
  });

const userUpdateSchema = createUpdateSchema(user).required({ id: true });
const userSelectSchema = createSelectSchema(user);
export const updateUser = createServerFn({ method: "POST" })
  .validator(userUpdateSchema)
  .handler(async ({ data: { id, ...data } }) => {
    console.info(`Updating user with id ${id}...`);

    // Check if user exists
    const existingUser = await db().query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    // Update user
    const updatedAt = new Date();
    const result = await db()
      .update(user)
      .set({
        ...data,
        updatedAt,
      })
      .where(eq(user.id, id))
      .returning();

    return result[0];
  });

export const fetchUserByEmail = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const user = await db().query.user.findFirst({
      where: (user, { eq }) => eq(user.email, data),
    });
    if (!user) {
      throw new Error(`User with email ${data} not found`);
    }
    return user;
  });

// Query Options
export const usersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: () => fetchUsers(),
  });

export const userByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userKeys.byId(id),
    queryFn: () => fetchUserById({ data: id }),
    enabled: !!id,
  });

export const userByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryKey: userKeys.byEmail(email),
    queryFn: () => fetchUserByEmail({ data: email }),
    enabled: !!email,
  });

// Mutation Options
export const useUpdateUserMutation = () => ({
  mutationFn: (input: z.infer<typeof userUpdateSchema>) =>
    updateUser({ data: input }),
  onSuccess: (
    _data: z.infer<typeof userSelectSchema>,
    variables: z.infer<typeof userUpdateSchema>
  ) => {
    // Invalidate the affected queries
    return [
      { queryKey: userKeys.all },
      { queryKey: userKeys.byId(variables.id) },
    ];
  },
});
