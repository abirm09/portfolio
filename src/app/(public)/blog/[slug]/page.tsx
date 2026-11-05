import { BlogCard } from "@/components/blog/BlogCard";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
  incrementBlogViews,
} from "@/lib/supabase/blogs";
import { ArrowLeft, Calendar, Clock, Eye, Sparkles } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const blogs = await getBlogPosts({ publishedOnly: true });
  return blogs.map((blog) => ({ slug: blog.slug }));
};

export const generateMetadata = async ({ params }: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    return { title: "Article Not Found — Abir Mahmud" };
  }

  return {
    title: `${blog.title} — Abir Mahmud`,
    description: blog.excerpt || blog.title,
    keywords: blog.tags,
    authors: [{ name: blog.author?.name || "Abir Mahmud" }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.published_at,
      images: blog.cover_image?.url ? [{ url: blog.cover_image.url, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image?.url ? [blog.cover_image.url] : [],
    },
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Fire view count increment asynchronously
  incrementBlogViews(slug).catch(() => {});

  const relatedPosts = await getRelatedBlogPosts(slug, blog.category, 2);

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <SectionWrapper className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl">
        {/* Navigation back */}
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>
        </Button>

        {/* Article Header Meta */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default" className="text-xs font-semibold">
              {blog.category}
            </Badge>

            {blog.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3 w-3 fill-current" />
                Featured Article
              </span>
            )}
          </div>

          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl md:leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
              {blog.excerpt}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="border-border/70 flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-accent text-brand-accent-foreground relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full font-bold">
                {blog.author?.avatar ? (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>AM</span>
                )}
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">{blog.author?.name}</p>
                <p className="text-muted-foreground text-xs">{blog.author?.role}</p>
              </div>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs font-medium">
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {blog.reading_time || 5} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {(blog.views || 0).toLocaleString()} views
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {blog.cover_image?.url && (
          <div className="border-border/70 bg-muted relative mb-12 aspect-video w-full overflow-hidden rounded-2xl border shadow-lg">
            <Image
              src={blog.cover_image.url}
              alt={blog.cover_image.alt || blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <article
          className="text-foreground/90 [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_ol]:text-muted-foreground [&_pre]:bg-secondary/70 [&_pre]:border-border/60 [&_code]:bg-secondary [&_code]:text-primary [&_blockquote]:border-primary [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_table]:border-border/70 [&_th]:bg-muted/50 [&_th]:border-border/60 [&_td]:border-border/60 mb-12 max-w-none text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded-sm [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:leading-relaxed [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-5 [&_p]:text-base [&_p]:leading-relaxed [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:p-3 [&_th]:border [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="border-border/70 mb-10 border-t pt-6">
            <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Topics & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground rounded-lg px-3 py-1 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Bar */}
        <div className="mb-16">
          <BlogShareBar title={blog.title} slug={blog.slug} />
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="border-border/70 border-t pt-12">
            <h3 className="text-foreground mb-6 text-2xl font-bold tracking-tight">
              Related Articles
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <BlogCard key={post.slug} blog={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SectionWrapper>
  );
}
