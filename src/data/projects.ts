export type TProjectLiveURL = {
  id: number;
  name: string;
  url: string;
};

export type TProjectImage = {
  id: number;
  url: string;
  title: string;
};

export type TProjectRepo = {
  id: number;
  title: string;
  url: string;
};

export type TTechStack =
  | "nextjs"
  | "tailwindcss"
  | "shadcn"
  | "typescript"
  | "javascript"
  | "nodejs"
  | "express"
  | "mongodb"
  | "postgresql"
  | "prisma"
  | "nestjs"
  | "redis"
  | "turborepo"
  | "bullmq"
  | "zod"
  | "react"
  | "react-query"
  | "zustand"
  | "redux"
  | "contextApi";

export const TECH_STACK_LABELS: Record<TTechStack, string> = {
  nextjs: "Next.js",
  tailwindcss: "Tailwind CSS",
  shadcn: "shadcn/ui",
  typescript: "TypeScript",
  javascript: "JavaScript",
  nodejs: "Node.js",
  express: "Express",
  mongodb: "MongoDB",
  postgresql: "PostgreSQL",
  prisma: "Prisma",
  nestjs: "NestJS",
  redis: "Redis",
  turborepo: "Turborepo",
  bullmq: "BullMQ",
  zod: "Zod",
  react: "React",
  "react-query": "React Query",
  zustand: "Zustand",
  redux: "Redux",
  contextApi: "Context API",
};

export type TProject = {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: TTechStack[];
  thumb: TProjectImage;
  image_gallery: TProjectImage[];
  live_url: TProjectLiveURL[];
  github_url: TProjectRepo[];
  case_study_url: TProjectRepo[];
  featured: boolean;
};

const PLACEHOLDER_IMAGE = "/images/projects/project-placeholder.svg";

// Curated portfolio projects, grounded in the local project repositories.
export const project: TProject[] = [
  {
    id: 1,
    title: "Pixlcart",
    slug: "pixlcart",
    description:
      "An omnichannel e-commerce tenant platform with a storefront, merchant dashboard, point-of-sale interface, and an Express API. Built as a Turborepo monorepo with Next.js, PostgreSQL, Prisma, and Redis.",
    tech_stack: [
      "nextjs",
      "typescript",
      "express",
      "postgresql",
      "prisma",
      "redis",
      "redux",
      "turborepo",
    ],
    thumb: { id: 1, url: PLACEHOLDER_IMAGE, title: "Pixlcart commerce platform" },
    image_gallery: [],
    live_url: [],
    github_url: [],
    case_study_url: [],
    featured: true,
  },
  {
    id: 2,
    title: "Zenpixl CPA",
    slug: "zenpixl-cpa",
    description:
      "An affiliate network platform for managing offers, advertisers, affiliates, tracking links, conversions, and reporting. Built with Next.js, TypeScript, Express, Prisma, PostgreSQL, and Redis.",
    tech_stack: ["nextjs", "typescript", "express", "postgresql", "prisma", "redis", "turborepo"],
    thumb: { id: 2, url: PLACEHOLDER_IMAGE, title: "Zenpixl CPA platform" },
    image_gallery: [],
    live_url: [],
    github_url: [],
    case_study_url: [],
    featured: true,
  },
  {
    id: 3,
    title: "Enterprise E-commerce",
    slug: "enterprise-ecommerce",
    description:
      "A modular omnichannel commerce platform with a Next.js storefront, NestJS API, background workers, inventory and logistics workflows, and an immutable double-entry ledger.",
    tech_stack: [
      "nextjs",
      "typescript",
      "nestjs",
      "postgresql",
      "prisma",
      "redis",
      "bullmq",
      "zod",
      "turborepo",
    ],
    thumb: { id: 3, url: PLACEHOLDER_IMAGE, title: "Enterprise e-commerce platform" },
    image_gallery: [],
    live_url: [],
    github_url: [],
    case_study_url: [],
    featured: true,
  },
  {
    id: 4,
    title: "SkillOxygen",
    slug: "skill-oxygen",
    description:
      "An interview platform for mock interviews, scheduling, payments, feedback, and secure dashboards for professionals and job seekers.",
    tech_stack: ["nextjs", "typescript", "nodejs", "express", "mongodb", "postgresql", "prisma"],
    thumb: { id: 4, url: PLACEHOLDER_IMAGE, title: "SkillOxygen dashboard" },
    image_gallery: [],
    live_url: [{ id: 1, name: "skilloxgen.com", url: "https://skilloxgen.com" }],
    github_url: [],
    case_study_url: [],
    featured: false,
  },
];

export const getAllProjects = (): TProject[] => project;

export const getFeaturedProjects = (limit = 3): TProject[] => {
  const featured = project.filter((p) => p.featured);
  const rest = project.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
};

export const getProjectBySlug = (slug: string): TProject | undefined =>
  project.find((p) => p.slug === slug);
