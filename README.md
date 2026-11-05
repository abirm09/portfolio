# Portfolio Web App

Modern, full-stack personal portfolio and content management dashboard built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, Supabase, and TipTap.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, standalone output)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (SSR, Auth, Storage, Database)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Tooling & Quality**: [pnpm](https://pnpm.io/), ESLint flat config, Prettier with Tailwind plugin, Husky, lint-staged, Commitlint

---

## Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.x` (Recommended: `24.x`)
- [pnpm](https://pnpm.io/) `>= 10.x` (Recommended: `12.x`)

To install or enable `pnpm`:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd abirmahmud
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials for Supabase and SMTP mail service:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous client key.
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`: Storage bucket name (default: `project-images`).
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.
- `SMTP_*`: Credentials for email notifications on contact form submission.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script              | Command                                      | Description                                       |
| ------------------- | -------------------------------------------- | ------------------------------------------------- |
| `pnpm dev`          | `next dev`                                   | Start development server with Turbopack           |
| `pnpm build`        | `next build`                                 | Build optimized production bundle                 |
| `pnpm start`        | `next start`                                 | Run production server                             |
| `pnpm typecheck`    | `tsc --noEmit`                               | Run TypeScript type checks                        |
| `pnpm lint`         | `eslint`                                     | Run ESLint checks                                 |
| `pnpm lint:fix`     | `eslint --fix`                               | Automatically fix fixable ESLint errors           |
| `pnpm format`       | `prettier --write .`                         | Format codebase using Prettier & Tailwind plugin  |
| `pnpm format:check` | `prettier --check .`                         | Check codebase formatting without modifying files |
| `pnpm validate`     | `pnpm run typecheck && pnpm run lint`        | Run complete validation pipeline                  |
| `pnpm clean`        | `rm -rf .next out dist tsconfig.tsbuildinfo` | Remove build caches and artifacts                 |

---

## Code Quality & Git Hooks

This project enforces quality gates automatically:

- **Pre-commit**: Runs `lint-staged` with `eslint --fix` and `prettier --write` on staged files.
- **Commit-msg**: Enforces [Conventional Commits](https://www.conventionalcommits.org/) format using `commitlint` (e.g. `feat: add new project card`, `fix: header responsive padding`).
- **Pre-push**: Runs `pnpm run typecheck` to prevent pushing type errors.
- **CI Workflow**: Runs automated validation (typecheck, lint, prettier check, and build) on all pull requests and pushes to `main`.

---

## Docker Deployment

Build and run using Docker:

```bash
# Build Docker image
docker build -t portfolio:latest .

# Run container
docker run -p 3000:3000 --env-file .env portfolio:latest
```

Or using Docker Compose:

```bash
docker compose up -d
```

---

## Project Structure

```
.
├── .github/workflows/    # CI/CD workflows
├── .husky/               # Git hook scripts (pre-commit, commit-msg, pre-push)
├── .vscode/              # Editor configurations and recommended extensions
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, route handlers)
│   ├── assets/           # Media and image assets
│   ├── components/       # Reusable React components & UI primitives
│   │   ├── dashboard/    # Admin dashboard components
│   │   ├── sections/     # Landing page sections
│   │   ├── textEditor/   # TipTap rich text editor
│   │   └── ui/           # Radix & Tailwind design system components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions, Supabase clients, mailer
│   └── providers/        # React Context providers (QueryClient, Themes)
├── Dockerfile            # Multi-stage production container build
├── next.config.ts        # Next.js configuration
├── pnpm-lock.yaml        # pnpm lockfile
└── tsconfig.json         # TypeScript compiler configuration
```
