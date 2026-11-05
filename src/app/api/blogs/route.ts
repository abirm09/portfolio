import { getBlogPosts } from "@/lib/supabase/blogs";
import { saveBlogAction } from "@/lib/supabase/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const publishedOnly = searchParams.get("publishedOnly") !== "false";

    const blogs = await getBlogPosts({
      publishedOnly,
      category,
      tag,
      limit,
    });

    return NextResponse.json({
      success: true,
      total: blogs.length,
      data: blogs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog posts";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await saveBlogAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process blog post creation";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
