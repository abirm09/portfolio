# Supabase Integration & Dashboard Guide

This project is connected to **Supabase** for:

1. **PostgreSQL Database**: Storing and managing projects dynamically.
2. **Supabase Storage**: Storing project thumbnails and gallery screenshots in the `project-images` bucket.
3. **Supabase Auth**: Protecting the `/dashboard` admin routes.

---

## 1. Supabase Project Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open your project's **SQL Editor**.
3. Copy the entire contents of [`supabase/schema.sql`](./schema.sql) and click **Run**.
   - This creates the `projects` table with all indexes.
   - Enables Row Level Security (RLS) with public read and authenticated write policies.
   - Creates the `project-images` Storage bucket with public image access and authenticated uploads.
   - Seeds the initial showcase projects into your database.

For an **existing** Supabase project with the upload error `new row violates row-level security policy`, run [`fix-storage-rls.sql`](./fix-storage-rls.sql) in the SQL Editor. This updates only the storage bucket and its policies, without rerunning the project seeds. Sign in to `/dashboard/login` again before retrying an upload.

---

## 2. Configure Environment Variables

Create or update `.env.local` in the root of your project:

```env
# Get these from Supabase Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Storage Bucket (default: project-images)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=project-images
```

---

## 3. Create Admin User for Dashboard

To access `/dashboard`:

1. In the Supabase Dashboard, go to **Authentication -> Users**.
2. Click **Add User** -> **Create User**.
3. Enter your email and a secure password (check "Auto-confirm user").
4. Visit `http://localhost:3000/dashboard/login` and sign in!

---

## 4. Dashboard Features

- **Overview (`/dashboard`)**: Metric cards for projects, featured counts, Supabase connection status, and one-click database syncing.
- **Projects List (`/dashboard/projects`)**: Search, filter by featured/standard status, fast featured toggling, edit, and delete.
- **Add / Edit Project (`/dashboard/projects/new`, `/dashboard/projects/[id]/edit`)**:
  - Live upload of thumbnails and gallery images directly to your Supabase Storage bucket.
  - Automatic slug generation.
  - Multi-select tech stack tags + custom tags.
  - Dynamic link repeaters (Live Demo, GitHub, Case Studies).
- **Media & Storage (`/dashboard/media`)**:
  - Direct file uploads to the Supabase `project-images` bucket.
  - File browser with copy public URL and delete options.
