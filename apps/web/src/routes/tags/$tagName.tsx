import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { ThreadList } from "@/components/threads/ThreadList";
import { tagByNameQueryOptions, threadsByTagQueryOptions, type Thread } from "@/lib/queries";

export const Route = createFileRoute("/tags/$tagName")({
  component: TagThreadsPage,
  errorComponent: ErrorComponent,
  loader: async ({ params, context }) => {
    const tag = await context.queryClient.ensureQueryData(
      tagByNameQueryOptions(params.tagName)
    );
    const threads = await context.queryClient.ensureQueryData(
      threadsByTagQueryOptions(params.tagName)
    );
    return { tag, threads };
  },
});

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="p-4">
      <div className="text-destructive">
        Error: {error?.message || "Failed to load data"}
      </div>
    </div>
  );
}

function TagThreadsPage() {
  const { tag, threads } = Route.useLoaderData();

  return (
    <div className="space-y-4 p-4">
      {tag && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tag: {tag.name}</h1>
          {tag.description && (
            <p className="text-muted-foreground">{tag.description}</p>
          )}
        </div>
      )}

      <ThreadList
        threads={threads}
        showCreateButton={true}
        createPath="/threads/new"
      />
    </div>
  );
}
