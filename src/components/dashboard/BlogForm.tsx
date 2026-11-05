"use client";

import TextEditor from "@/components/textEditor";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/Textarea";
import {
  BLOG_CATEGORIES,
  calculateReadingTime,
  DEFAULT_BLOG_AUTHOR,
  TBlogPost,
} from "@/data/blogs";
import { useSaveBlogMutation } from "@/hooks/useBlogsQuery";
import { uploadProjectFile } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Star,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BlogFormProps = {
  initialData?: TBlogPost;
};

export const BlogForm = ({ initialData }: BlogFormProps) => {
  const router = useRouter();
  const saveMutation = useSaveBlogMutation();

  const isEditing = Boolean(initialData?.id);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState<string>(initialData?.category || "System Design");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image?.url ||
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  );
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.cover_image?.alt || "");
  const [readingTime, setReadingTime] = useState<number>(initialData?.reading_time || 5);
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug && !isEditing) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (newContent) {
      const time = calculateReadingTime(newContent);
      setReadingTime(time);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setErrorMessage(null);
      const res = await uploadProjectFile(file, "blog-covers");
      if (res.error) {
        throw new Error(res.error);
      }
      setCoverImageUrl(res.url);
      if (!coverImageAlt) {
        setCoverImageAlt(title || file.name);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image. You can provide a direct URL.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage("Article title is required.");
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("URL slug is required.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Article content cannot be empty.");
      return;
    }

    const payload: Partial<TBlogPost> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      cover_image: {
        url: coverImageUrl.trim(),
        alt: coverImageAlt.trim() || title.trim(),
      },
      category: category.trim(),
      tags,
      reading_time: readingTime || calculateReadingTime(content),
      published,
      featured,
      author: initialData?.author || DEFAULT_BLOG_AUTHOR,
      published_at: published
        ? initialData?.published_at || new Date().toISOString()
        : initialData?.published_at || undefined,
    };

    saveMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(
          isEditing ? "Blog post updated successfully!" : "Blog post created successfully!",
        );
        setTimeout(() => {
          router.push("/dashboard/blogs");
        }, 800);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Failed to save blog post.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header & Actions */}
      <div className="border-border/70 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/dashboard/blogs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData?.title}` : "Write New Article"}
            </h1>
            <p className="text-muted-foreground text-xs">
              {isEditing
                ? "Update and publish changes to your blog post."
                : "Craft a comprehensive technical deep-dive with rich markdown and code blocks."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${initialData?.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Preview Public
              </Link>
            </Button>
          )}

          <Button type="submit" size="sm" disabled={saveMutation.isPending} className="gap-2">
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "Save Changes" : "Create Article"}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-xl border p-4 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Content Area (left) + Settings Sidebar (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Title, Excerpt, Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold">
              Article Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Architecting Distributed Queue Workflows with BullMQ"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-base font-semibold"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-sm font-semibold">
                URL Slug <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-primary flex items-center gap-1 text-xs hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                {autoSlug ? "Auto-generating (click to edit)" : "Manual mode (click for auto)"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs select-none">/blog/</span>
              <Input
                placeholder="architecting-distributed-queues"
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value);
                }}
                className="font-mono text-xs"
                required
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold">Summary / Excerpt</label>
            <Textarea
              placeholder="A concise, compelling 1-2 sentence overview shown on blog index cards and search engine meta descriptions..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="text-sm leading-relaxed"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-sm font-semibold">
                Article Body (Rich Text & Code) <span className="text-destructive">*</span>
              </label>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" /> Estimated read: {readingTime} min
              </span>
            </div>
            <div className="bg-card border-border/70 overflow-hidden rounded-xl border">
              <TextEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Write your article in depth. Use headings (H2, H3), lists, quotes, tables, and formatted code blocks..."
                minHeight={450}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Meta, Publishing, Cover Image, Category, Tags */}
        <div className="space-y-6">
          {/* Publishing & Visibility Card */}
          <div className="bg-card border-border/70 space-y-4 rounded-xl border p-5 shadow-xs">
            <h3 className="text-foreground text-sm font-bold">Publishing Status</h3>

            {/* Published Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-foreground text-xs font-semibold">Publish Post</label>
                <p className="text-muted-foreground text-[11px]">
                  {published
                    ? "Visible to the public on the blog"
                    : "Draft mode (only visible to admin)"}
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>

            {/* Featured Switch */}
            <div className="border-border/60 flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  Featured Post
                </label>
                <p className="text-muted-foreground text-[11px]">
                  Highlight at the top of the blog index
                </p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>

            {/* Reading Time */}
            <div className="border-border/60 space-y-1.5 border-t pt-3">
              <label className="text-foreground text-xs font-semibold">
                Reading Time (minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={60}
                value={readingTime}
                onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 1)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Category Card */}
          <div className="bg-card border-border/70 space-y-3 rounded-xl border p-5 shadow-xs">
            <h3 className="text-foreground text-sm font-bold">Category</h3>
            <Input
              placeholder="e.g. Architecture"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 text-xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-card border-border/70 space-y-3 rounded-xl border p-5 shadow-xs">
            <h3 className="text-foreground text-sm font-bold">Tags</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="h-8 text-xs"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddTag}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 text-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image Card */}
          <div className="bg-card border-border/70 space-y-4 rounded-xl border p-5 shadow-xs">
            <h3 className="text-foreground text-sm font-bold">Cover Image</h3>

            {/* Preview */}
            {coverImageUrl ? (
              <div className="border-border/60 bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt={coverImageAlt || "Blog cover preview"}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted/40 border-border/60 flex aspect-video w-full items-center justify-center rounded-lg border">
                <ImageIcon className="text-muted-foreground h-8 w-8" />
              </div>
            )}

            {/* Direct URL */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Image URL</label>
              <Input
                placeholder="https://..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="h-8 font-mono text-xs"
              />
            </div>

            {/* Alt Text */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Alt Description</label>
              <Input
                placeholder="Short description for accessibility"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* File Upload Option */}
            <div className="border-border/60 border-t pt-3">
              <label className="text-muted-foreground mb-1 block text-xs">
                Or upload image file:
              </label>
              <label className="bg-secondary/70 hover:bg-secondary text-foreground border-border/60 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors">
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{uploadingImage ? "Optimizing & uploading..." : "Choose Image File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
