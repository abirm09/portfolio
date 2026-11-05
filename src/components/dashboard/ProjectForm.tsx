"use client";

import TextEditor from "@/components/textEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TECH_STACK_LABELS,
  TProject,
  TProjectImage,
  TProjectLiveURL,
  TProjectRepo,
} from "@/data/projects";
import { useSaveProjectMutation } from "@/hooks/useProjectsQuery";
import { uploadProjectFile } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ExternalLink,
  FileText,
  GitBranch,
  Image as ImageIcon,
  Link2,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const POPULAR_TECH_STACKS = Object.entries(TECH_STACK_LABELS).map(([key, label]) => ({
  id: key,
  label,
}));

// Additional suggestions
const EXTRA_TECH_STACKS = [
  { id: "supabase", label: "Supabase" },
  { id: "docker", label: "Docker" },
  { id: "graphql", label: "GraphQL" },
  { id: "python", label: "Python" },
];

const ALL_TECH_SUGGESTIONS = Array.from(
  new Map([...POPULAR_TECH_STACKS, ...EXTRA_TECH_STACKS].map((tech) => [tech.id, tech])).values(),
);

type ProjectFormProps = {
  initialData?: TProject;
};

export const ProjectForm = ({ initialData }: ProjectFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);
  const saveMutation = useSaveProjectMutation();

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugModified, setSlugModified] = useState(Boolean(initialData?.slug));
  const [description, setDescription] = useState(initialData?.description || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [techStack, setTechStack] = useState<string[]>(
    initialData?.tech_stack || ["nextjs", "tailwindcss", "typescript"],
  );
  const [customTechInput, setCustomTechInput] = useState("");

  // Media
  const [thumb, setThumb] = useState<TProjectImage>(
    initialData?.thumb || {
      id: 1,
      url: "/images/projects/project-placeholder.svg",
      title: "",
    },
  );
  const [imageGallery, setImageGallery] = useState<TProjectImage[]>(
    initialData?.image_gallery || [],
  );

  // Dynamic Links
  const [liveUrls, setLiveUrls] = useState<TProjectLiveURL[]>(
    initialData?.live_url && initialData.live_url.length > 0
      ? initialData.live_url
      : [{ id: 1, name: "Live Demo", url: "" }],
  );
  const [githubUrls, setGithubUrls] = useState<TProjectRepo[]>(
    initialData?.github_url && initialData.github_url.length > 0
      ? initialData.github_url
      : [{ id: 1, title: "Source Code", url: "" }],
  );
  const [caseStudyUrls, setCaseStudyUrls] = useState<TProjectRepo[]>(
    initialData?.case_study_url || [],
  );

  // Upload States
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Submission States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugModified) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  // Tech stack toggling
  const toggleTech = (techId: string) => {
    if (techStack.includes(techId)) {
      setTechStack(techStack.filter((t) => t !== techId));
    } else {
      setTechStack([...techStack, techId]);
    }
  };

  const addCustomTech = () => {
    if (!customTechInput.trim()) return;
    const sanitized = customTechInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!techStack.includes(sanitized)) {
      setTechStack([...techStack, sanitized]);
    }
    setCustomTechInput("");
  };

  // Thumbnail upload
  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setErrorMessage(null);

    try {
      const { url, error } = await uploadProjectFile(file, "thumbnails");
      if (error) {
        setErrorMessage(`Thumbnail upload failed: ${error}`);
      } else if (url) {
        setThumb({
          id: thumb.id || 1,
          url,
          title: thumb.title || title || file.name,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload thumbnail.");
    } finally {
      setUploadingThumb(false);
    }
  };

  // Gallery multi-upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage(null);

    try {
      const newImages: TProjectImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, error } = await uploadProjectFile(file, "gallery");
        if (error) {
          setErrorMessage(`Failed to upload ${file.name}: ${error}`);
        } else if (url) {
          newImages.push({
            id: Date.now() + i,
            url,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          });
        }
      }
      if (newImages.length > 0) {
        setImageGallery([...imageGallery, ...newImages]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Live URLs Handlers
  const addLiveUrl = () => {
    setLiveUrls([...liveUrls, { id: Date.now(), name: "Live Demo", url: "" }]);
  };
  const removeLiveUrl = (id: number) => {
    setLiveUrls(liveUrls.filter((item) => item.id !== id));
  };
  const updateLiveUrl = (id: number, field: "name" | "url", value: string) => {
    setLiveUrls(liveUrls.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // GitHub URLs Handlers
  const addGithubUrl = () => {
    setGithubUrls([...githubUrls, { id: Date.now(), title: "Source Code", url: "" }]);
  };
  const removeGithubUrl = (id: number) => {
    setGithubUrls(githubUrls.filter((item) => item.id !== id));
  };
  const updateGithubUrl = (id: number, field: "title" | "url", value: string) => {
    setGithubUrls(githubUrls.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Case Study URLs Handlers
  const addCaseStudyUrl = () => {
    setCaseStudyUrls([...caseStudyUrls, { id: Date.now(), title: "Case Study", url: "" }]);
  };
  const removeCaseStudyUrl = (id: number) => {
    setCaseStudyUrls(caseStudyUrls.filter((item) => item.id !== id));
  };
  const updateCaseStudyUrl = (id: number, field: "title" | "url", value: string) => {
    setCaseStudyUrls(
      caseStudyUrls.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage("Project Title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Slug is required.");
      return;
    }

    const filteredLiveUrls = liveUrls.filter((u) => u.url.trim() !== "");
    const filteredGithubUrls = githubUrls.filter((u) => u.url.trim() !== "");
    const filteredCaseStudyUrls = caseStudyUrls.filter((u) => u.url.trim() !== "");

    const payload: Partial<TProject> = {
      id: initialData?.id,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      featured,
      tech_stack: techStack as any,
      thumb: {
        id: thumb.id || 1,
        url: thumb.url.trim() || "/images/projects/project-placeholder.svg",
        title: thumb.title.trim() || title.trim(),
      },
      image_gallery: imageGallery.filter((img) => img.url.trim() !== ""),
      live_url: filteredLiveUrls,
      github_url: filteredGithubUrls,
      case_study_url: filteredCaseStudyUrls,
    };

    saveMutation.mutate(payload, {
      onSuccess: (res) => {
        setSuccessMessage(res.message || "Project saved successfully!");
        setTimeout(() => {
          router.push("/dashboard/projects");
          router.refresh();
        }, 800);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Failed to save project.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl space-y-6">
      {/* Action Header Bar */}
      <div className="bg-card border-border flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="bg-border hidden h-4 w-px sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-foreground max-w-xs truncate text-sm font-bold sm:max-w-md">
              {title || "Untitled Project"}
            </span>
            {featured && (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                <Star className="h-3 w-3 fill-amber-500" /> Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/dashboard/projects">Cancel</Link>
          </Button>
          <Button type="submit" variant="default" size="sm" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "Update Project" : "Create Project"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error & Success Feedback Alerts */}
      {errorMessage && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-3 rounded-xl border p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Error saving project</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
          <Check className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm font-medium">{successMessage}</div>
        </div>
      )}

      {/* Top Section: Project Metadata & Settings Card */}
      <div className="bg-card border-border space-y-6 rounded-2xl border p-6 shadow-xs">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {/* Project Title */}
          <div className="space-y-2">
            <label className="text-foreground text-xs font-bold tracking-wider uppercase">
              Project Title *
            </label>
            <Input
              placeholder="e.g. SkillOxygen, E-Commerce Management"
              value={title}
              onChange={handleTitleChange}
              required
              className="h-10 text-sm font-semibold"
            />
          </div>

          {/* URL Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                URL Slug *
              </label>
              <span className="text-muted-foreground font-mono text-[11px]">
                /projects/{slug || "..."}
              </span>
            </div>
            <Input
              placeholder="e.g. skill-oxygen"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugModified(true);
              }}
              required
              className="h-10 font-mono text-xs"
            />
          </div>

          {/* Featured Project Switch */}
          <div className="space-y-2">
            <label className="text-foreground text-xs font-bold tracking-wider uppercase">
              Visibility & Feature
            </label>
            <div className="bg-secondary/30 border-border flex h-10 items-center justify-between rounded-xl border p-2">
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Star
                  className={`h-3.5 w-3.5 ${featured ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                />
                <span>Featured on Home</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="bg-secondary peer peer-checked:after:border-primary-foreground after:bg-card after:border-border peer-checked:bg-primary h-5 w-9 rounded-full peer-focus:outline-hidden after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </div>

        {/* Tech Stack Chips & Custom Input */}
        <div className="border-border/70 space-y-3 border-t pt-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <label className="text-foreground text-xs font-bold tracking-wider uppercase">
              Technologies & Tech Stack ({techStack.length} selected)
            </label>
            <p className="text-muted-foreground text-[11px]">
              Click tags to toggle or type below to add custom tags.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_TECH_SUGGESTIONS.map((tech) => {
              const selected = techStack.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={cn(
                    "cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
                    selected
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {tech.label}
                </button>
              );
            })}

            {/* Custom active tags */}
            {techStack
              .filter((t) => !ALL_TECH_SUGGESTIONS.some((s) => s.id === t))
              .map((custom) => (
                <button
                  key={custom}
                  type="button"
                  onClick={() => toggleTech(custom)}
                  className="bg-primary text-primary-foreground border-primary flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium font-semibold"
                >
                  {custom}
                  <X className="h-3 w-3" />
                </button>
              ))}
          </div>

          {/* Add custom tech */}
          <div className="flex max-w-md items-center gap-2 pt-1">
            <Input
              placeholder="Add custom technology (e.g. AWS, WebSockets, Redis)..."
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTech();
                }
              }}
              className="h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addCustomTech}
              className="h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabbed Area: Description (Full Width), Media, and Links */}
      <Tabs defaultValue="description" className="w-full space-y-4">
        <TabsList className="bg-secondary/50 border-border/80 grid h-11 w-full grid-cols-3 rounded-xl border p-1 sm:inline-flex sm:w-auto">
          <TabsTrigger value="description" className="h-9 gap-2 rounded-lg px-5 text-xs font-bold">
            <FileText className="text-primary h-4 w-4" />
            <span>Description</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="h-9 gap-2 rounded-lg px-5 text-xs font-bold">
            <ImageIcon className="text-primary h-4 w-4" />
            <span>Media & Assets</span>
            <span className="py-0.2 bg-secondary text-muted-foreground rounded-full px-1.5 text-[10px]">
              {1 + imageGallery.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="links" className="h-9 gap-2 rounded-lg px-5 text-xs font-bold">
            <Link2 className="text-primary h-4 w-4" />
            <span>Links & Repos</span>
            <span className="py-0.2 bg-secondary text-muted-foreground rounded-full px-1.5 text-[10px]">
              {liveUrls.filter((u) => u.url).length + githubUrls.filter((u) => u.url).length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FULL-WIDTH DESCRIPTION (TIPTAP RICH TEXT EDITOR) */}
        <TabsContent value="description" className="space-y-4 outline-none">
          <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
            <div className="border-border/70 flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                  <FileText className="text-primary h-4 w-4" /> Project Description & Case Study
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Write detailed case studies, highlight features, insert tables, format code
                  blocks, and embed media.
                </p>
              </div>
              <span className="text-primary flex items-center gap-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" /> Full Width Editor
              </span>
            </div>

            {/* TipTap Full Width Editor */}
            <div className="w-full">
              <TextEditor
                content={description}
                onChange={(val) => setDescription(val)}
                placeholder="Write your comprehensive project overview, problem statement, architecture, tech stack highlights, and achievements..."
                minHeight={420}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: MEDIA & ASSETS (THUMBNAIL & GALLERY) */}
        <TabsContent value="media" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {/* Thumbnail Card */}
            <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                    <ImageIcon className="text-primary h-4 w-4" /> Project Cover Thumbnail
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Main image displayed on portfolio home and cards.
                  </p>
                </div>
              </div>

              {/* Cover Preview */}
              <div className="border-border bg-secondary/30 relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.url || "/images/projects/project-placeholder.svg"}
                  alt={thumb.title || "Thumbnail Preview"}
                  className="h-full w-full object-cover"
                />
                {uploadingThumb && (
                  <div className="bg-background/75 text-primary absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs font-semibold backdrop-blur-xs">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Uploading to Supabase...
                  </div>
                )}
              </div>

              {/* Upload to Supabase Storage Button */}
              <label className="border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs font-semibold transition-colors">
                <Upload className="h-4 w-4" />
                Upload New Cover to Supabase Bucket
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbUpload}
                  disabled={uploadingThumb}
                  className="hidden"
                />
              </label>

              {/* URL input */}
              <div className="space-y-2 pt-1">
                <label className="text-muted-foreground text-xs font-semibold">
                  Or Direct Image URL
                </label>
                <Input
                  placeholder="https://..."
                  value={thumb.url}
                  onChange={(e) => setThumb({ ...thumb, url: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* Thumbnail Title */}
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-semibold">
                  Thumbnail Alt / Title
                </label>
                <Input
                  placeholder="e.g. Dashboard view screenshot"
                  value={thumb.title}
                  onChange={(e) => setThumb({ ...thumb, title: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Gallery Screenshots Card */}
            <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                    <ImageIcon className="text-primary h-4 w-4" /> Gallery Screenshots
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Additional interface screenshots for project detail page.
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">{imageGallery.length} items</span>
              </div>

              {/* Multi-upload to Supabase */}
              <label className="border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary text-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs font-medium transition-colors">
                {uploadingGallery ? (
                  <>
                    <Loader2 className="text-primary h-4 w-4 animate-spin" />
                    Uploading gallery images to Supabase...
                  </>
                ) : (
                  <>
                    <Upload className="text-primary h-4 w-4" />
                    Upload Multiple Screenshots to Supabase
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>

              {/* Gallery list */}
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {imageGallery.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-xs italic">
                    No screenshots added to gallery yet.
                  </p>
                ) : (
                  imageGallery.map((img, idx) => (
                    <div
                      key={img.id}
                      className="border-border/80 bg-secondary/20 flex items-center gap-3 rounded-xl border p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.title}
                        className="bg-secondary border-border h-14 w-14 shrink-0 rounded-lg border object-cover"
                      />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Input
                          placeholder="Image caption (e.g. Analytics view)"
                          value={img.title}
                          onChange={(e) => {
                            const next = [...imageGallery];
                            next[idx].title = e.target.value;
                            setImageGallery(next);
                          }}
                          className="h-7 text-xs"
                        />
                        <Input
                          placeholder="Image URL"
                          value={img.url}
                          onChange={(e) => {
                            const next = [...imageGallery];
                            next[idx].url = e.target.value;
                            setImageGallery(next);
                          }}
                          className="text-muted-foreground h-7 font-mono text-[11px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageGallery(imageGallery.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-destructive shrink-0 p-2 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: LINKS & REPOSITORIES */}
        <TabsContent value="links" className="space-y-6 outline-none">
          <div className="bg-card border-border space-y-6 rounded-2xl border p-6 shadow-xs">
            {/* Live URLs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                    <ExternalLink className="text-primary h-4 w-4" /> Live Demo URLs
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Public URLs where visitors can preview or test the live application.
                  </p>
                </div>
                <Button type="button" variant="outline" size="xs" onClick={addLiveUrl}>
                  <Plus className="h-3 w-3" /> Add Live Link
                </Button>
              </div>

              {liveUrls.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Link Label (e.g. skilloxygen.com)"
                    value={item.name}
                    onChange={(e) => updateLiveUrl(item.id, "name", e.target.value)}
                    className="w-1/3 text-xs"
                  />
                  <Input
                    placeholder="https://..."
                    value={item.url}
                    onChange={(e) => updateLiveUrl(item.id, "url", e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeLiveUrl(item.id)}
                    className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* GitHub Repos */}
            <div className="border-border/70 space-y-3 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                    <GitBranch className="text-primary h-4 w-4" /> GitHub / Source Code Repositories
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Links to frontend, backend, or full-stack repository code.
                  </p>
                </div>
                <Button type="button" variant="outline" size="xs" onClick={addGithubUrl}>
                  <Plus className="h-3 w-3" /> Add Repository
                </Button>
              </div>

              {githubUrls.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Repo Title (e.g. Frontend Repository)"
                    value={item.title}
                    onChange={(e) => updateGithubUrl(item.id, "title", e.target.value)}
                    className="w-1/3 text-xs"
                  />
                  <Input
                    placeholder="https://github.com/..."
                    value={item.url}
                    onChange={(e) => updateGithubUrl(item.id, "url", e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeGithubUrl(item.id)}
                    className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Case Studies */}
            <div className="border-border/70 space-y-3 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
                    <FileText className="text-primary h-4 w-4" /> External Case Study / Article
                    Links
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Links to Medium, Dev.to, or external architecture articles.
                  </p>
                </div>
                <Button type="button" variant="outline" size="xs" onClick={addCaseStudyUrl}>
                  <Plus className="h-3 w-3" /> Add Case Study Link
                </Button>
              </div>

              {caseStudyUrls.length === 0 ? (
                <p className="text-muted-foreground text-xs italic">
                  No external case study links added yet.
                </p>
              ) : (
                caseStudyUrls.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Title (e.g. Deep Dive Article)"
                      value={item.title}
                      onChange={(e) => updateCaseStudyUrl(item.id, "title", e.target.value)}
                      className="w-1/3 text-xs"
                    />
                    <Input
                      placeholder="https://..."
                      value={item.url}
                      onChange={(e) => updateCaseStudyUrl(item.id, "url", e.target.value)}
                      className="flex-1 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeCaseStudyUrl(item.id)}
                      className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};
