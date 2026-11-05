"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BLOG_CATEGORIES, TBlogPost } from "@/data/blogs";
import { useBlogs, useSeedBlogsMutation } from "@/hooks/useBlogsQuery";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  FileCheck,
  FileEdit,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BlogRowActions } from "./BlogRowActions";

type BlogListClientProps = {
  initialBlogs: TBlogPost[];
};

export const BlogListClient = ({ initialBlogs }: BlogListClientProps) => {
  const { data: blogs = initialBlogs } = useBlogs({ publishedOnly: false }, initialBlogs);
  const seedMutation = useSeedBlogsMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = blogs.filter((b) => !b.published).length;
  const featuredCount = blogs.filter((b) => b.featured).length;
  const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const filteredBlogs = blogs.filter((blog) => {
    // Search query matching
    const query = search.toLowerCase().trim();
    const matchesQuery =
      !query ||
      blog.title.toLowerCase().includes(query) ||
      blog.slug.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query) ||
      blog.category?.toLowerCase().includes(query) ||
      blog.tags?.some((t) => t.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    // Status filter
    if (filter === "published" && !blog.published) return false;
    if (filter === "draft" && blog.published) return false;
    if (filter === "featured" && !blog.featured) return false;

    // Category filter
    if (
      selectedCategory !== "All" &&
      blog.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-card border-border/70 rounded-xl border p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Total Posts</span>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="text-foreground mt-2 text-2xl font-bold">{blogs.length}</p>
        </div>

        <div className="bg-card border-border/70 rounded-xl border p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Published</span>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">{publishedCount}</p>
        </div>

        <div className="bg-card border-border/70 rounded-xl border p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Drafts</span>
            <FileEdit className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{draftCount}</p>
        </div>

        <div className="bg-card border-border/70 rounded-xl border p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Total Views</span>
            <Eye className="text-primary h-4 w-4" />
          </div>
          <p className="text-foreground mt-2 text-2xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search articles by title, tags, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="bg-secondary/50 border-border/60 flex items-center gap-1.5 self-start rounded-xl border p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({blogs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("published")}
            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "published"
                ? "bg-card text-emerald-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("draft")}
            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "draft"
                ? "bg-card text-amber-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Drafts ({draftCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("featured")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "featured"
                ? "bg-card text-amber-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-3 w-3 fill-amber-500" /> Featured ({featuredCount})
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">Category:</span>
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            selectedCategory === "All"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Posts Table */}
      <div className="bg-card border-border/70 overflow-hidden rounded-xl border shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted/40 border-border/70 text-muted-foreground border-b text-xs font-medium">
                <th className="px-4 py-3 sm:px-6">Article</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Read Time</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                      No blog posts match your criteria.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <Button asChild size="sm" variant="default">
                        <Link href="/dashboard/blogs/new">
                          <Plus className="mr-1 h-4 w-4" />
                          Write First Post
                        </Link>
                      </Button>
                      {blogs.length === 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => seedMutation.mutate()}
                          disabled={seedMutation.isPending}
                        >
                          {seedMutation.isPending ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-1 h-4 w-4" />
                          )}
                          Seed Default Articles
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {blog.featured && (
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />
                          )}
                          <Link
                            href={`/dashboard/blogs/${blog.id}/edit`}
                            className="text-foreground hover:text-primary line-clamp-1 font-semibold transition-colors"
                          >
                            {blog.title}
                          </Link>
                        </div>
                        <span className="text-muted-foreground mt-0.5 font-mono text-xs">
                          /{blog.slug}
                        </span>
                        <div className="text-muted-foreground mt-1 flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {blog.published_at
                              ? new Date(blog.published_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Not published"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="text-xs">
                        {blog.category}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="text-muted-foreground px-4 py-4 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.reading_time || 5} min
                      </span>
                    </td>

                    <td className="text-muted-foreground px-4 py-4 text-xs font-medium whitespace-nowrap">
                      {(blog.views || 0).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <BlogRowActions blog={blog} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
