export type TBlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type TBlogCoverImage = {
  url: string;
  alt: string;
};

export type TBlogCategory =
  | "Architecture"
  | "Next.js"
  | "PostgreSQL"
  | "System Design"
  | "DevOps"
  | "Frontend"
  | "TypeScript";

export type TBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: TBlogCoverImage;
  category: TBlogCategory | string;
  tags: string[];
  reading_time: number;
  published: boolean;
  featured: boolean;
  views: number;
  author: TBlogAuthor;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_BLOG_AUTHOR: TBlogAuthor = {
  name: "Abir Mahmud",
  role: "Fullstack & Systems Engineer",
  avatar: "/images/hero/hero-avatar.png",
};

export const BLOG_CATEGORIES: TBlogCategory[] = [
  "Architecture",
  "Next.js",
  "PostgreSQL",
  "System Design",
  "DevOps",
  "Frontend",
  "TypeScript",
];

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const cleanText = content.replace(/<[^>]*>/g, " ");
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export const staticBlogs: TBlogPost[] = [
  {
    id: 1,
    title: "Architecting High-Throughput Background Job Pipelines with BullMQ and Redis",
    slug: "architecting-background-job-pipelines-bullmq-redis",
    excerpt:
      "A battle-tested blueprint for designing reliable asynchronous message queues, atomic job transitions, rate limiting, and backoff retry policies in production Node.js ecosystems.",
    cover_image: {
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      alt: "Server racks and cloud infrastructure representing distributed message queues",
    },
    category: "System Design",
    tags: ["Node.js", "Redis", "BullMQ", "Microservices", "Queues"],
    reading_time: 7,
    published: true,
    featured: true,
    views: 1420,
    author: DEFAULT_BLOG_AUTHOR,
    published_at: "2026-02-15T10:00:00Z",
    created_at: "2026-02-15T09:30:00Z",
    updated_at: "2026-02-15T10:00:00Z",
    content: `
<h2>The Problem: Synchronous Bottlenecks in Modern Web APIs</h2>
<p>In standard monolithic and microservice architectures alike, HTTP request-response cycles are sacred. Forcing a user's web browser or mobile client to wait while the server compiles a 50-page PDF invoice, syncs catalog data across three third-party CRM APIs, or decodes webhook event streams is an architectural anti-pattern that destroys perceived performance and exhausts server thread pools.</p>

<p>The solution is asynchronous job offloading. By decoupling the command (HTTP request acknowledgement) from execution (background worker processing), we achieve immediate sub-50ms API response latencies while buffering workloads gracefully against traffic spikes.</p>

<h2>Why BullMQ Over Plain In-Memory Queues?</h2>
<p>While lightweight in-memory queues (such as Node.js <code>EventEmitter</code> or standard JavaScript arrays) suffice for toy scripts, they fail completely in mission-critical distributed production environments:</p>

<ul>
  <li><strong>Crash Resilience:</strong> If a Node.js process crashes midway through job processing, unpersisted memory jobs evaporate instantly.</li>
  <li><strong>Horizontal Scalability:</strong> Multiple stateless API nodes cannot share an in-memory queue without complex clustering and inter-process messaging.</li>
  <li><strong>Atomic Operations via Lua:</strong> BullMQ executes queue mutations inside Redis through atomic Lua scripts. This eliminates race conditions during job locking, delayed execution, and stall detection.</li>
  <li><strong>Exponential Backoff:</strong> Automatic retries with jitter and dead-letter queues prevent cascading stampedes against failing upstream services.</li>
</ul>

<h2>Configuring an Isolated Redis Connection Pool</h2>
<p>One common pitfall when integrating BullMQ is connection contention. BullMQ workers require dedicated blocking connections for <code>BRPOPLPUSH</code> / streams alongside normal command connections. Here is the resilient configuration setup:</p>

<pre><code class="language-typescript">import { Queue, Worker, QueueEvents } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    return err.message.slice(0, targetError.length) === targetError;
  },
});

export const orderQueue = new Queue("order-processing", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});
</code></pre>

<h2>Handling Concurrency, Sandboxing, and Stalled Jobs</h2>
<p>When running compute-heavy tasks (e.g. image transformations or complex SQL aggregations), executing workers inside the primary Node.js event loop blocks incoming I/O. BullMQ supports sandboxed workers that spawn separate OS worker processes:</p>

<pre><code class="language-typescript">// worker-runner.ts
import { Worker } from "bullmq";
import path from "node:path";

const processorPath = path.join(__dirname, "sandboxed-processor.js");

export const orderWorker = new Worker("order-processing", processorPath, {
  connection: redisConnection,
  concurrency: 10,
  lockDuration: 30000,
  stalledInterval: 15000,
  maxStalledCount: 2,
});

orderWorker.on("completed", (job) => {
  console.log(\`Job \${job.id} completed successfully for tenant \${job.data.tenantId}\`);
});

orderWorker.on("failed", (job, err) => {
  console.error(\`Job \${job?.id} failed after \${job?.attemptsMade} attempts: \${err.message}\`);
});
</code></pre>

<h2>Key Metrics & Observability</h2>
<p>To keep queue latency predictable, monitor four primary telemetry metrics in production:</p>
<ol>
  <li><strong>Queue Latency / Waiting Time:</strong> The duration between job submission and worker pickup. Spikes indicate inadequate worker concurrency.</li>
  <li><strong>Stall Count:</strong> When workers freeze due to unhandled exceptions, memory exhaustion, or network timeouts.</li>
  <li><strong>Dead Letter Rate:</strong> Percentage of jobs reaching max retry limits and moving to the failed state.</li>
  <li><strong>Redis Memory Allocation:</strong> Clean up completed job artifacts aggressively with <code>removeOnComplete</code> to prevent Redis eviction policies from purging pending queue items.</li>
</ol>
`,
  },
  {
    id: 2,
    title: "Deep-Dive: Production-Grade Multi-Tenant Isolation with PostgreSQL RLS and Prisma",
    slug: "multi-tenant-isolation-postgresql-rls-prisma",
    excerpt:
      "How to implement impenetrable database multi-tenancy at the PostgreSQL engine layer using Row Level Security, session variables, and Prisma Client extensions.",
    cover_image: {
      url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
      alt: "Relational database schema blueprints and encrypted database columns",
    },
    category: "PostgreSQL",
    tags: ["PostgreSQL", "RLS", "Prisma", "Database", "Security"],
    reading_time: 8,
    published: true,
    featured: true,
    views: 1180,
    author: DEFAULT_BLOG_AUTHOR,
    published_at: "2026-02-02T14:00:00Z",
    created_at: "2026-02-02T13:00:00Z",
    updated_at: "2026-02-02T14:00:00Z",
    content: `
<h2>The Multi-Tenancy Conundrum</h2>
<p>Every SaaS engineer encounters the multi-tenancy dilemma. Should you isolate customers using:</p>
<ul>
  <li><strong>Database-per-tenant:</strong> Total isolation, but nightmare DevOps management, migration overhead, and cost scaling for thousands of SMBs.</li>
  <li><strong>Schema-per-tenant:</strong> Better connection pooling, but Postgres table locks during schema migrations degrade as tenant counts pass 500+.</li>
  <li><strong>Shared-database with tenant_id column:</strong> Highly efficient and cost-effective, but vulnerable to a single developer forgetting a <code>WHERE tenant_id = ?</code> clause, causing cataclysmic data leakage.</li>
</ul>

<p>PostgreSQL Row Level Security (RLS) offers the ultimate hybrid: the efficiency and unified schema of a single database, backed by kernel-level security guarantees that make data leakage mathematically impossible at the query engine level.</p>

<h2>Enabling RLS and Session Context in Postgres</h2>
<p>First, enable RLS on tenant-sensitive tables and define security policies that inspect a transactional runtime variable:</p>

<pre><code class="language-sql">-- Enable RLS on core tenant entities
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (crucial for pooled connections)
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

-- Define tenant isolation policy using session setting
CREATE POLICY tenant_isolation_policy ON orders
  AS RESTRICTIVE
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::BIGINT
  )
  WITH CHECK (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::BIGINT
  );
</code></pre>

<h2>Hooking RLS into Prisma with Client Extensions</h2>
<p>Prisma connects via a shared connection pool, meaning transactions must set and reset <code>app.current_tenant_id</code> per query boundary. Prisma Client Extensions make this transparent to application code:</p>

<pre><code class="language-typescript">import { PrismaClient } from "@prisma/client";

const basePrisma = new PrismaClient();

export function createTenantPrisma(tenantId: number) {
  return basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, result] = await basePrisma.$transaction([
            basePrisma.$executeRawUnsafe(
              \`SET LOCAL app.current_tenant_id = '\${tenantId}'\`
            ),
            query(args),
          ]);
          return result;
        },
      },
    },
  });
}
</code></pre>

<h2>Bypassing RLS for System Operations & Background Cron</h2>
<p>Background daemons (e.g. system backups, billing reconciliations, or cross-tenant aggregate dashboards) sometimes require elevated access. In Postgres, this is handled through a designated super-tenant role or explicit bypass setting:</p>

<pre><code class="language-sql">CREATE POLICY admin_bypass_policy ON orders
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
</code></pre>

<h2>Performance Impact & Indexing Strategies</h2>
<p>Does RLS hurt query planning? Not when paired with composite indices. When Postgres evaluates <code>tenant_id = current_setting(...)</code>, it pushes the predicate down to index scans:</p>

<pre><code class="language-sql">-- Compound index with tenant_id always as the leading column
CREATE INDEX idx_orders_tenant_created ON orders (tenant_id, created_at DESC);
CREATE INDEX idx_invoices_tenant_status ON invoices (tenant_id, status);
</code></pre>
<p>With this index strategy, the query planner executes lightning-fast index range scans without full table reads.</p>
`,
  },
  {
    id: 3,
    title: "Mastering Next.js 15+ & 16 App Router: Turbopack, Streaming SSR, and Cache Lifecycles",
    slug: "mastering-nextjs-app-router-turbopack-streaming-ssr",
    excerpt:
      "A pragmatic guide to navigating modern Next.js paradigms: unlearning Pages Router habits, mastering React 19 async request params, and orchestrating instant Suspense streaming.",
    cover_image: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      alt: "Code editor displaying TypeScript and Next.js React Server Components",
    },
    category: "Next.js",
    tags: ["Next.js", "React 19", "Turbopack", "Performance", "Fullstack"],
    reading_time: 6,
    published: true,
    featured: false,
    views: 890,
    author: DEFAULT_BLOG_AUTHOR,
    published_at: "2026-01-20T11:00:00Z",
    created_at: "2026-01-20T10:15:00Z",
    updated_at: "2026-01-20T11:00:00Z",
    content: `
<h2>The Shift to Asynchronous Request APIs</h2>
<p>The progression of Next.js 15 and 16 with React 19 introduced a foundational paradigm shift: <code>params</code>, <code>searchParams</code>, <code>cookies()</code>, and <code>headers()</code> are now asynchronous Promises rather than plain synchronous objects.</p>

<p>This allows Next.js to start server-rendering pages before the dynamic request context has fully resolved, facilitating Partial Prerendering (PPR) and edge rendering.</p>

<pre><code class="language-typescript">// Next.js 15/16 App Router Page Component
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  
  const post = await getBlogPost(slug);
  return &lt;BlogPostView post={post} activeTab={tab || "overview"} /&gt;;
}
</code></pre>

<h2>Granular Suspense Streaming vs All-or-Nothing SSR</h2>
<p>In older fullstack applications, a slow third-party API call (e.g. fetching external currency rates or live user presence) blocked the entire HTML response. The user saw a blank white screen until the slowest service answered.</p>

<p>With React 19 Suspense boundaries, Next.js streams the critical structural HTML, navigation, and hero content immediately to the browser within 30ms, streaming dynamic widget skeletons until background promises settle.</p>

<pre><code class="language-tsx">import { Suspense } from "react";
import { ArticleHeader, SkeletonAuthor, LiveAnalytics } from "@/components";

export default function ArticlePage({ slug }: { slug: string }) {
  return (
    &lt;main className="container mx-auto py-12"&gt;
      &lt;ArticleHeader slug={slug} /&gt;
      
      {/* Non-blocking dynamic widget stream */}
      &lt;Suspense fallback={&lt;SkeletonAuthor /&gt;}&gt;
        &lt;LiveAnalytics slug={slug} /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}
</code></pre>

<h2>Turbopack in Local Development and Production Builds</h2>
<p>Turbopack's native Rust compilation engine reduces cold start compilation times from 15+ seconds down to milliseconds. When configuring monorepos, explicitly setting the Turbopack workspace root in <code>next.config.ts</code> avoids path inference issues:</p>

<pre><code class="language-typescript">import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
  },
};

export default nextConfig;
</code></pre>
`,
  },
  {
    id: 4,
    title:
      "Industrial Monorepo Engineering: Speeding Up CI/CD with Turborepo, pnpm & Remote Caching",
    slug: "industrial-monorepo-turborepo-pnpm-remote-caching",
    excerpt:
      "Eliminate redundant test, lint, and build executions in modern engineering teams using workspace dependency graphs, content hashing, and pnpm symlink hoisting.",
    cover_image: {
      url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80",
      alt: "Continuous integration pipelines and git commit dependency graphs",
    },
    category: "Architecture",
    tags: ["Turborepo", "pnpm", "DevOps", "CI/CD", "Monorepo"],
    reading_time: 5,
    published: true,
    featured: false,
    views: 950,
    author: DEFAULT_BLOG_AUTHOR,
    published_at: "2026-01-10T09:00:00Z",
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
    content: `
<h2>Why Polyrepos Stagnate Growing Engineering Teams</h2>
<p>In a multirepo setup, sharing a UI component library, database schema, or TypeScript validation model between a frontend Next.js app and an Express/NestJS backend requires publishing internal npm packages on every commit. Version synchronization drifts, and end-to-end type safety across the network boundary is compromised.</p>

<p>A unified Turborepo monorepo powered by pnpm solves this by treating internal packages as symlinked live workspace references.</p>

<h2>The Superiority of pnpm Content-Addressable Storage</h2>
<p>Traditional npm or yarn package managers duplicate gigabytes of <code>node_modules</code> dependencies across multiple workspaces. In contrast, pnpm stores packages in a centralized global content-addressable storage, linking them into projects using hard links and symlinks.</p>

<p>This delivers:</p>
<ul>
  <li><strong>Instant package installs:</strong> 3x to 5x faster than legacy npm.</li>
  <li><strong>Zero phantom dependencies:</strong> Code cannot import packages that aren't explicitly declared in its local <code>package.json</code>.</li>
  <li><strong>Strict workspace boundaries:</strong> Packages use <code>"workspace:*"</code> dependencies for zero-overhead local development.</li>
</ul>

<h2>Configuring turbo.json Pipelines</h2>
<p>Turborepo models your repository as a Directed Acyclic Graph (DAG). It computes a SHA-256 hash of each task's source files, environment variables, and dependencies. If the hash hasn't changed, Turborepo skips execution entirely and restores cached artifacts within milliseconds.</p>

<pre><code class="language-json">{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
</code></pre>
`,
  },
];
