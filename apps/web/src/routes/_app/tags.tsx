import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tagsWithStatsQueryOptions } from "@/lib/queries/tags";
import { TagBadge } from "@/components/tags/TagBadge";

export const Route = createFileRoute("/_app/tags")({
  component: TagsPage,
  loader: async ({ context }) => {
    const tags = await context.queryClient.ensureQueryData(
      tagsWithStatsQueryOptions()
    );
    return { tags };
  },
});

function TagsPage() {
  const { tags } = Route.useLoaderData();

  if (!tags || tags.length === 0) {
    return <div className="p-4">No tags found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            id={tag.id}
            name={tag.name}
            slug={tag.slug}
            threadCount={tag.threadCount}
            color={tag.color || undefined}
            showCount={true}
          />
        ))}
      </div>
    </div>
  );
}
