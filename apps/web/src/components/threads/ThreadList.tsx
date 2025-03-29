import { ThreadItem } from "./ThreadItem";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Link } from "@tanstack/react-router";
import { fetchThreads } from "@/lib/queries";

interface ThreadListProps {
  threads?: Awaited<ReturnType<typeof fetchThreads>>;
  isLoading?: boolean;
  error?: Error | null;
  showCreateButton?: boolean;
  createPath?: string;
}

export function ThreadList({
  threads,
  isLoading = false,
  error = null,
  showCreateButton = true,
  createPath = "..",
}: ThreadListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive mb-4">
          Error loading threads: {error.message || "Unknown error"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground mb-4">No threads found.</p>
        {showCreateButton && (
          <Button asChild>
            <Link to={createPath}>Create Thread</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link to={createPath}>Create Thread</Link>
          </Button>
        </div>
      )}

      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          {...thread}
          replyCount={0} // We'd need to retrieve post counts separately
        />
      ))}
    </div>
  );
}
