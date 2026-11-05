import { Badge } from "@/components/ui/Badge";
import { TBlogPost } from "@/data/blogs";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  blog: TBlogPost;
  className?: string;
  featured?: boolean;
};

export const BlogCard = ({ blog, className, featured }: BlogCardProps) => {
  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={cn(
        "group card-glass relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        featured && "md:col-span-2 md:grid md:grid-cols-2 md:items-center",
        className,
      )}
    >
      {/* Featured Badge */}
      {blog.featured && (
        <div className="bg-brand-accent text-brand-accent-foreground absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-xs">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      {/* Cover Image */}
      <div
        className={cn(
          "bg-muted relative overflow-hidden",
          featured ? "h-64 w-full sm:h-72 md:h-full" : "h-52 w-full",
        )}
      >
        {blog.cover_image?.url ? (
          <Image
            src={blog.cover_image.url}
            alt={blog.cover_image.alt || blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="bg-secondary/50 text-muted-foreground flex h-full w-full items-center justify-center">
            No cover image
          </div>
        )}
        <div className="from-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      {/* Content */}
      <div className={cn("flex flex-1 flex-col p-6", featured && "md:p-8")}>
        {/* Meta Bar: Category, Date, Read time */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="font-medium">
            {blog.category}
          </Badge>

          <span className="text-muted-foreground/40">•</span>

          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {blog.reading_time || 5} min read
          </span>

          {formattedDate && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-foreground group-hover:text-primary mb-2 font-bold transition-colors",
            featured ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
          {blog.excerpt || blog.content.replace(/<[^>]*>?/gm, "").slice(0, 160)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-secondary/70 text-muted-foreground rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-muted-foreground text-[11px] font-medium">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
            Read Article
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
