import { BlogArchiveClient } from "@/components/blog/BlogArchiveClient";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getBlogPosts } from "@/lib/supabase/blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Blog & Architecture Insights — Abir Mahmud",
  description:
    "In-depth articles and production case studies on distributed message queues, PostgreSQL multi-tenancy, Next.js App Router performance, and industrial monorepos.",
  openGraph: {
    title: "Engineering Blog & Architecture Insights — Abir Mahmud",
    description:
      "Production case studies on distributed queues, database architectures, and fullstack TypeScript systems.",
    type: "website",
  },
};

export default async function BlogArchivePage() {
  const blogs = await getBlogPosts({ publishedOnly: true });

  return (
    <SectionWrapper className="min-h-[75vh]">
      <SectionTitle
        title="Technical Writing"
        subtitle="In-depth engineering notes, system design patterns, and production lessons learned from real-world applications."
      />

      <BlogArchiveClient blogs={blogs} />
    </SectionWrapper>
  );
}
