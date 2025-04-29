import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  // This would eventually fetch data from the server
  const threads = [
    {
      id: "1",
      title: "Welcome to FossSpace Forum",
      slug: "welcome-to-fossspace-forum",
      category: { name: "Announcements", slug: "announcements" },
      author: { name: "Admin", username: "admin" },
      tags: [{ name: "welcome", slug: "welcome" }],
      postCount: 5,
      viewCount: 120,
      lastActivity: new Date().toISOString(),
    },
    {
      id: "2",
      title: "How to contribute to open source projects",
      slug: "how-to-contribute-to-open-source",
      category: { name: "General Discussion", slug: "general" },
      author: { name: "OpenSourceLover", username: "opensource-lover" },
      tags: [
        { name: "guide", slug: "guide" },
        { name: "beginners", slug: "beginners" },
      ],
      postCount: 12,
      viewCount: 345,
      lastActivity: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      title: "Recommendations for learning JavaScript in 2024",
      slug: "recommendations-for-learning-javascript",
      category: { name: "Help & Support", slug: "help" },
      author: { name: "JSNewbie", username: "js-newbie" },
      tags: [
        { name: "javascript", slug: "javascript" },
        { name: "learning", slug: "learning" },
      ],
      postCount: 8,
      viewCount: 210,
      lastActivity: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Discussions</h1>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          <Link to="/threads/new">New Thread</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {threads.map((thread) => (
          <Card key={thread.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl hover:text-primary">
                    <Link to={`/threads/${thread.slug}`}>{thread.title}</Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Posted in{" "}
                    <Link
                      to={`/categories/${thread.category.slug}`}
                      className="text-primary hover:underline"
                    >
                      {thread.category.name}
                    </Link>{" "}
                    by{" "}
                    <Link
                      to={`/users/${thread.author.username}`}
                      className="text-primary hover:underline"
                    >
                      {thread.author.name}
                    </Link>
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(thread.lastActivity)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1">
                {thread.tags.map((tag) => (
                  <Badge
                    key={tag.slug}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 text-sm text-muted-foreground">
              <div className="flex gap-4">
                <span>{thread.viewCount} views</span>
                <span>{thread.postCount} replies</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}
