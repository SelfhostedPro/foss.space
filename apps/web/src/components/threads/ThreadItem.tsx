import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { TagBadge } from '@/components/tags/TagBadge';
import { fetchThreads } from '@/lib/queries';

// Define the props type using the return type of fetchThreads 
type ThreadItemProps = Awaited<ReturnType<typeof fetchThreads>>[number] & {
  replyCount?: number; // Additional prop not in the thread type
};

export function ThreadItem(props: ThreadItemProps) {
  const {
    title,
    slug,
    author,
    category,
    createdAt,
    updatedAt,
    viewCount = 0,
    replyCount = 0,
    isPinned = false,
    isLocked = false,
    threadTags = []
  } = props;
  
  // Format dates
  const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const updatedDate = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isUpdated = updatedDate.getTime() - createdDate.getTime() > 1000; // More than 1 second difference
  
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isPinned && (
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              Pinned
            </span>
          )}
          {isLocked && (
            <span className="px-2 py-0.5 text-xs bg-destructive/10 text-destructive rounded-full">
              Locked
            </span>
          )}
        </div>
        <CardTitle>
          <a href={`/threads/${slug}`} className="text-xl hover:text-primary">
            {title}
          </a>
        </CardTitle>
        <CardDescription>
          Posted by {author?.name || 'Anonymous'} in <a href={`/categories/${category?.slug || ''}`} className="hover:underline">{category?.name || 'Uncategorized'}</a>
        </CardDescription>
      </CardHeader>
      
      {threadTags && threadTags.length > 0 && (
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2">
            {threadTags.map(threadTag => {
              // Ensure tag has required string values
              if (!threadTag.tag?.name || !threadTag.tag?.slug) return null;
              
              return (
                <TagBadge
                  key={threadTag.tagId}
                  id={threadTag.tagId}
                  name={threadTag.tag.name}
                  slug={threadTag.tag.slug}
                  color={threadTag.tag.color || undefined}
                  showCount={false}
                />
              );
            })}
          </div>
        </CardContent>
      )}
      
      <CardFooter>
        <div className="w-full flex flex-wrap justify-between text-sm text-muted-foreground">
          <div>
            {isUpdated ? (
              <span>Updated {formatDate(updatedDate)}</span>
            ) : (
              <span>Posted {formatDate(createdDate)}</span>
            )}
          </div>
          <div className="flex gap-3">
            <span>{viewCount} views</span>
            <span>{replyCount} replies</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 