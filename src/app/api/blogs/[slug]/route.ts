import { getBlogPostBySlug, incrementBlogViews } from "@/lib/supabase/blogs";
import { NextRequest, NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: `Blog post with slug "${slug}" not found`,
        },
        { status: 404 },
      );
    }

    // Fire view count increment asynchronously without blocking response
    incrementBlogViews(slug).catch(() => {});

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog post";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
