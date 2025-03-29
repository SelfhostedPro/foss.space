import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { threadsQueryOptions } from "@/lib/queries/threads";
import { ThreadList } from "@/components/threads/ThreadList";

export const Route = createFileRoute("/threads/")({
  component: ThreadsIndexPage,
});

function ThreadsIndexPage() {
  const { data: threads, isLoading, error } = useQuery(threadsQueryOptions());

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Discussions</h1>
        <p className="text-muted-foreground mt-2">
          Browse all discussions in the forum
        </p>
      </div>

      <ThreadList
        threads={threads}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        showCreateButton={true}
        createPath="/threads/new"
      />
    </div>
  );
}
