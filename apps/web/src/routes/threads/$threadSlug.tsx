import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import {
  threadBySlugQueryOptions,
  postsByThreadIdQueryOptions,
  tagsByThreadIdQueryOptions,
} from "@/lib/queries";
import { format } from "date-fns";
import { MessageSquare, Eye, Tag } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const Route = createFileRoute("/threads/$threadSlug")({
  component: ThreadDetailPage,
  pendingComponent: DetailSkeleton,
  errorComponent: DetailError,
  loader: async ({ context, params }) => {
    const thread = await context.queryClient.ensureQueryData(
      threadBySlugQueryOptions(params.threadSlug)
    );
    const posts = await context.queryClient.ensureQueryData(
      postsByThreadIdQueryOptions(thread?.id || "")
    );
    const tags = await context.queryClient.ensureQueryData(
      tagsByThreadIdQueryOptions(thread?.id || "")
    );
    return { thread, posts, tags };
  },
});

function DetailError({ error }: ErrorComponentProps) {
  return (
    <div className="p-4">
      <div className="text-destructive">
        Error: {error?.message || "Failed to load thread"}
      </div>
    </div>
  );
}
function DetailSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-8 mt-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

function ThreadDetailPage() {
  const { threadSlug } = Route.useParams();

  const { thread, posts, tags } = Route.useLoaderData();

  if (!thread) {
    return (
      <div className="p-4">
        <div className="text-destructive">Thread not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{thread.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Posted in{" "}
            <a
              href={`/categories/${thread.category.slug}`}
              className="text-primary hover:underline"
            >
              {thread.category.name}
            </a>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {thread.viewCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {posts.length}
          </span>
          <span>{format(new Date(thread.createdAt), "MMM d, yyyy")}</span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Tag className="h-4 w-4 mr-1" />
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="hover:bg-accent cursor-pointer"
                onClick={() => (window.location.href = `/tags/${tag.id}`)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 mt-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.author?.image || ""}
                  alt={post.author?.name || "User"}
                />
                <AvatarFallback>{post.author?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author?.name || "User"}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(post.createdAt), "MMM d, yyyy h:mm a")}
                </div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">{post.content}</div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-muted-foreground italic">No posts yet</div>
        )}
      </div>

      {!thread.isLocked && (
        <div className="mt-8">
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={() =>
              (window.location.href = `/threads/${thread.slug}/reply`)
            }
          >
            Reply to Thread
          </button>
        </div>
      )}

      {thread.isLocked && (
        <div className="mt-8 text-amber-600 flex items-center">
          <span className="mr-2">🔒</span>
          This thread is locked. New replies are not allowed.
        </div>
      )}
    </div>
  );
}
