import { BlogForm } from "@/components/dashboard/BlogForm";
import { getBlogPostById } from "@/lib/supabase/blogs";
import { notFound } from "next/navigation";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    notFound();
  }

  const blog = await getBlogPostById(numId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <BlogForm initialData={blog} />
    </div>
  );
}
