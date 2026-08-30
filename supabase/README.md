# Supabase Integration & Dashboard Guide

This project is connected to **Supabase** for:
1. **PostgreSQL Database**: Storing and managing projects dynamically.
2. **Supabase Storage**: Storing project thumbnails and gallery screenshots in a dedicated bucket (`projects`).
3. **Supabase Auth**: Protecting the `/dashboard` admin routes.

---

## 1. Supabase Project Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open your project's **SQL Editor**.
3. Copy the entire contents of [`supabase/schema.sql`](./schema.sql) and click **Run**.
   - This creates the `projects` table with all indexes.
   - Enables Row Level Security (RLS) with public read and authenticated write policies.
   - Creates the `projects` Storage Bucket with public image access.
   - Seeds all initial 6 showcase projects into your database.

---

## 2. Configure Environment Variables

Create or update `.env.local` in the root of your project:

```env
# Get these from Supabase Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Storage Bucket (default: projects)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=projects
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
  - Direct file uploads to the Supabase `projects` bucket.
  - File browser with copy public URL and delete options.
