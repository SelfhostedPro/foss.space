import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  categoryBySlugQueryOptions
} from "@/lib/queries/categories";
import {
  threadsByCategoryQueryOptions,
} from "@/lib/queries/threads";
import { ThreadList } from "@/components/threads/ThreadList";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const Route = createFileRoute("/categories/$categorySlug")({
  pendingComponent: CategoryThreadsPending,
  component: CategoryThreadsPage,
  loader: async ({ params, context }) => {
    const category = await context.queryClient.ensureQueryData(
      categoryBySlugQueryOptions(params.categorySlug)
    );
    const threads = await context.queryClient.ensureQueryData(
      threadsByCategoryQueryOptions(category?.id || "")
    );
    return { category, threads };
  },
});

function CategoryThreadsPending() {
  return (
    <div className="container py-6">
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function CategoryThreadsPage() {
  const { category, threads } = Route.useLoaderData();

  if (!category) {
    return (
      <div className="container py-6">
        <div className="text-destructive">Category not found</div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-2">
          {category.description || "Discussions related to this category"}
        </p>
      </div>

      <ThreadList
        threads={threads}
        showCreateButton={true}
        createPath="/threads/new"
      />
    </div>
  );
}
