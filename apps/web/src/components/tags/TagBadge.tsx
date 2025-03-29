import { Badge } from '@workspace/ui/components/badge';

interface TagBadgeProps {
  id: string;
  name: string;
  slug: string;
  threadCount?: number;
  color?: string;
  showCount?: boolean;
}

export function TagBadge({
  id,
  name,
  slug,
  threadCount = 0,
  color = '#6c757d',
  showCount = true
}: TagBadgeProps) {
  return (
    <a 
      key={id}
      href={`/tags/${slug}`} 
      className="group"
    >
      <Badge 
        className="px-3 py-1 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        style={{ 
          backgroundColor: `${color}20`, 
          color: color, 
          borderColor: `${color}40` 
        }}
      >
        {name}
        {showCount && threadCount > 0 && (
          <span className="ml-2 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
            {threadCount}
          </span>
        )}
      </Badge>
    </a>
  );
} 