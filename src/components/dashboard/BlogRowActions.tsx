"use client";

import { Button } from "@/components/ui/button";
import { TBlogPost } from "@/data/blogs";
import {
  useDeleteBlogMutation,
  useToggleFeaturedBlogMutation,
  useTogglePublishBlogMutation,
} from "@/hooks/useBlogsQuery";
import { Check, Edit, ExternalLink, Eye, EyeOff, Loader2, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BlogRowActionsProps = {
  blog: TBlogPost;
};

export const BlogRowActions = ({ blog }: BlogRowActionsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useDeleteBlogMutation();
  const togglePublishMutation = useTogglePublishBlogMutation();
  const toggleFeaturedMutation = useToggleFeaturedBlogMutation();

  const handleTogglePublish = () => {
    togglePublishMutation.mutate({
      id: blog.id,
      published: !blog.published,
    });
  };

  const handleToggleFeatured = () => {
    toggleFeaturedMutation.mutate({
      id: blog.id,
      featured: !blog.featured,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(blog.id, {
      onSuccess: () => {
        setShowConfirm(false);
      },
      onError: (err: any) => {
        alert(err.message || "Failed to delete blog post.");
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Featured Star toggle */}
      <button
        type="button"
        onClick={handleToggleFeatured}
        disabled={toggleFeaturedMutation.isPending}
        className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
          blog.featured
            ? "text-amber-500 hover:bg-amber-500/10"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
        title={blog.featured ? "Remove from Featured" : "Mark as Featured"}
      >
        {toggleFeaturedMutation.isPending ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Star className={`h-4 w-4 ${blog.featured ? "fill-amber-500" : ""}`} />
        )}
      </button>

      {/* Publish / Unpublish Toggle */}
      <button
        type="button"
        onClick={handleTogglePublish}
        disabled={togglePublishMutation.isPending}
        className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
          blog.published
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
        title={blog.published ? "Unpublish (Save as Draft)" : "Publish Post"}
      >
        {togglePublishMutation.isPending ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : blog.published ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>

      {/* View Public page */}
      <Button variant="ghost" size="icon-sm" asChild title="View public post">
        <Link href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>

      {/* Edit Post */}
      <Button variant="ghost" size="icon-sm" asChild title="Edit post">
        <Link href={`/dashboard/blogs/${blog.id}/edit`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>

      {/* Delete / Confirm */}
      {showConfirm ? (
        <div className="bg-destructive/10 border-destructive/20 flex items-center gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-destructive hover:bg-destructive/20 cursor-pointer rounded p-1"
            title="Confirm deletion"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer rounded p-1 text-xs"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowConfirm(true)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete post"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
