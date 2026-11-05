import { DashboardHeader } from "@/components/dashboard/Header";
import { BlogListClient } from "@/components/dashboard/BlogListClient";
import { getBlogPosts } from "@/lib/supabase/blogs";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardBlogsPage() {
  const blogs = await getBlogPosts({ publishedOnly: false });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Technical Blog Articles"
        subtitle={`Total of ${blogs.length} articles across engineering, system design, and architecture.`}
        action={{
          label: "New Article",
          href: "/dashboard/blogs/new",
          icon: Plus,
        }}
      />

      <BlogListClient initialBlogs={blogs} />
    </div>
  );
}
