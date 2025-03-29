import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesQueryOptions } from '@/lib/queries/categories';
import { tagsQueryOptions } from '@/lib/queries/tags';
import { useCreateThreadMutation, type CreateThreadInput, type ThreadCreateInput } from '@/lib/queries/threads';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/threads/new')({
  component: CreateThreadPage,
  // User will handle auth checks
});

function CreateThreadPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Fetch categories for dropdown
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading 
  } = useQuery(categoriesQueryOptions());
  
  // Fetch tags for selection
  const { 
    data: tags = [], 
    isLoading: isTagsLoading 
  } = useQuery(tagsQueryOptions());
  
  // Initialize form
  const form = useForm<{
    title: string;
    categoryId: string;
    initialPost: string;
    tagIds: string[];
  }>({
    defaultValues: {
      title: '',
      categoryId: '',
      initialPost: '',
      tagIds: [],
    },
  });
  
  // Get selected tags for display
  const selectedTagIds = form.watch('tagIds') || [];
  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  
  // Create thread mutation
  const createThread = useMutation({
    ...useCreateThreadMutation(),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      
      // Show success toast
      toast.success('Thread created successfully!');
      
      // Redirect to the new thread
      navigate({ to: `/threads/${data.slug}` });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create thread');
    },
  });
  
  // Form submission handler
  const onSubmit = (values: {
    title: string;
    categoryId: string;
    initialPost: string;
    tagIds: string[];
  }) => {
    const threadData: CreateThreadInput = {
      data: {
        title: values.title,
        categoryId: values.categoryId,
        userId: 'current-user-id', // This will be handled by the server
      },
      tagIds: values.tagIds,
    };
    
    // Create thread and its first post
    createThread.mutate(threadData);
  };
  
  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Thread</h1>
        <p className="text-muted-foreground mt-2">Start a new discussion</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thread Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Thread Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter thread title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isCategoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tags Selection */}
              <FormField
                control={form.control}
                name="tagIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedTags.map(tag => (
                        <Badge 
                          key={tag.id}
                          style={{ 
                            backgroundColor: tag.color || undefined,
                            color: tag.color ? '#ffffff' : undefined
                          }}
                        >
                          {tag.name}
                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none focus:ring-2"
                            onClick={() => {
                              form.setValue(
                                'tagIds',
                                selectedTagIds.filter(id => id !== tag.id)
                              );
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            if (!selectedTagIds.includes(value)) {
                              form.setValue('tagIds', [...selectedTagIds, value]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {isTagsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading tags...
                              </SelectItem>
                            ) : tags.length === 0 ? (
                              <SelectItem value="none" disabled>
                                No tags available
                              </SelectItem>
                            ) : (
                              tags
                                .filter(tag => !selectedTagIds.includes(tag.id))
                                .map(tag => (
                                  <SelectItem key={tag.id} value={tag.id}>
                                    <div className="flex items-center">
                                      <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: tag.color || '#888888' }}
                                      />
                                      <span>{tag.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Initial Post Content */}
              <FormField
                control={form.control}
                name="initialPost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Post</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your initial post here..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/threads' })}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createThread.isPending}
                >
                  {createThread.isPending 
                    ? 'Creating...' 
                    : 'Create Thread'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
