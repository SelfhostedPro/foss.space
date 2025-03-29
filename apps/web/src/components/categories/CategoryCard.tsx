import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  threadCount: number;
  postCount: number;
}

export function CategoryCard({
  id,
  name,
  slug,
  description,
  threadCount,
  postCount
}: CategoryCardProps) {
  return (
    <Card key={id} className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle>
          <a href={`/categories/${slug}`} className="text-xl hover:text-primary">
            {name}
          </a>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <span>{threadCount} threads</span>
          <span className="mx-2">•</span>
          <span>{postCount} posts</span>
        </div>
      </CardContent>
    </Card>
  );
} 