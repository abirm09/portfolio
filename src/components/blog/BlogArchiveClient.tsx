"use client";

import { Input } from "@/components/ui/Input";
import { BLOG_CATEGORIES, TBlogPost } from "@/data/blogs";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";

type BlogArchiveClientProps = {
  blogs: TBlogPost[];
};

export const BlogArchiveClient = ({ blogs }: BlogArchiveClientProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const query = search.toLowerCase().trim();
      const matchesQuery =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.tags?.some((t) => t.toLowerCase().includes(query));

      if (!matchesQuery) return false;

      if (
        selectedCategory !== "All" &&
        blog.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [blogs, search, selectedCategory]);

  const featuredBlog = useMemo(() => {
    if (selectedCategory !== "All" || search.trim() !== "") {
      return null;
    }
    return blogs.find((b) => b.featured) || blogs[0] || null;
  }, [blogs, selectedCategory, search]);

  const gridBlogs = useMemo(() => {
    if (featuredBlog && selectedCategory === "All" && search.trim() === "") {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, selectedCategory, search]);

  return (
    <div className="space-y-10">
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search articles by title, keywords, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 text-xs"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Hero Article (when on 'All' tab with no active search) */}
      {featuredBlog && (
        <div className="mb-4">
          <BlogCard blog={featuredBlog} featured />
        </div>
      )}

      {/* Articles Grid */}
      {gridBlogs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridBlogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="border-border/60 bg-card rounded-2xl border p-12 text-center">
          <p className="text-foreground text-lg font-semibold">No articles found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="text-primary mt-4 cursor-pointer text-sm font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
