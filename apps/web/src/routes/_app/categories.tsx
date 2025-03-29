import { createFileRoute } from "@tanstack/react-router";
import {
  categoriesWithStatsQueryOptions,
} from "@/lib/queries/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";

export const Route = createFileRoute("/_app/categories")({
  component: CategoriesPage,
  loader: async ({ context }) => {
    const categories = await context.queryClient.ensureQueryData(
      categoriesWithStatsQueryOptions()
    );
    return { categories };
  },
});

function CategoriesPage() {
  const { categories } = Route.useLoaderData();

  if (!categories || categories.length === 0) {
    return <div className="p-4">No categories found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            slug={category.slug}
            description={category.description || ""}
            threadCount={category.threadCount || 0}
            postCount={category.postCount || 0}
          />
        ))}
      </div>
    </div>
  );
}
