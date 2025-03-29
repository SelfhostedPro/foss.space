import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ThreadList } from '@/components/threads/ThreadList';
import { tagBySlugQueryOptions, threadsByTagQueryOptions } from '@/lib/queries';

export const Route = createFileRoute('/tags/$tagSlug')({
  component: TagThreadsPage,
});

function TagThreadsPage() {
  const { tagSlug } = Route.useParams();
  
  const tagQuery = useQuery(tagBySlugQueryOptions(tagSlug));
  const threadsQuery = useQuery(threadsByTagQueryOptions(tagSlug));
  
  const isLoading = tagQuery.isLoading || threadsQuery.isLoading;
  const isError = tagQuery.isError || threadsQuery.isError;
  const error = tagQuery.error || threadsQuery.error;
  
  if (isError) {
    return (
      <div className="p-4">
        <div className="text-destructive">
          Error: {error?.message || 'Failed to load data'}
        </div>
      </div>
    );
  }
  
  const tag = tagQuery.data;
  
  return (
    <div className="space-y-4 p-4">
      {tag && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tag: {tag.name}</h1>
          {tag.description && <p className="text-muted-foreground">{tag.description}</p>}
        </div>
      )}
      
      <ThreadList 
        threads={threadsQuery.data} 
        isLoading={isLoading} 
        error={error}
        showCreateButton={true}
        createPath="/threads/new"
      />
    </div>
  );
} 