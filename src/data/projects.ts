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
  | "fastApi"
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
  fastApi: "FastAPI",
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

// Projects data

export const project: TProject[] = [
  {
    id: 1,
    title: "SkillOxygen",
    slug: "skill-oxygen",
    description:
      "SkillOxygen is an interview platform where experienced professionals can conduct mock interviews for fresh graduates and job seekers. It includes features like interview scheduling, online payments, feedback collection, secure dashboards, and a monetization system.",
    tech_stack: [
      "nextjs",
      "tailwindcss",
      "shadcn",
      "typescript",
      "nodejs",
      "express",
      "mongodb",
      "postgresql",
      "prisma",
    ],
    thumb: {
      id: 1,
      url: PLACEHOLDER_IMAGE,
      title: "SkillOxygen dashboard",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "Interview scheduling dashboard" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Mock interview room" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Payments & feedback view" },
    ],
    live_url: [{ id: 1, name: "skilloxgen.com", url: "https://skilloxgen.com" }],
    github_url: [{ id: 1, title: "SkillOxygen", url: "https://github.com/skilloxgen" }],
    case_study_url: [
      { id: 1, title: "SkillOxygen Case Study", url: "https://github.com/skilloxgen" },
    ],
    featured: true,
  },
  {
    id: 2,
    title: "E-Commerce Management System",
    slug: "ecommerce-management-system",
    description:
      "A complete e-commerce platform with inventory management and accounting features, including product management, sales, customer management, dashboards, and reports.",
    tech_stack: ["react", "nodejs", "express", "mongodb", "postgresql", "prisma", "typescript"],
    thumb: {
      id: 2,
      url: PLACEHOLDER_IMAGE,
      title: "E-Commerce admin dashboard",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "Inventory management dashboard" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Sales & accounting reports" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Customer management view" },
    ],
    live_url: [{ id: 1, name: "Live Demo", url: "#" }],
    github_url: [{ id: 1, title: "Source Code", url: "#" }],
    case_study_url: [],
    featured: true,
  },
  {
    id: 3,
    title: "Fingerprint Authentication API",
    slug: "fingerprint-authentication-api",
    description:
      "A backend authentication system integrating Futronic fingerprint devices with FastAPI. Provides biometric verification, SDK integration, secure APIs, and template matching.",
    tech_stack: ["fastApi", "typescript"],
    thumb: {
      id: 3,
      url: PLACEHOLDER_IMAGE,
      title: "Fingerprint API architecture",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "API documentation" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Device enrollment flow" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Template matching results" },
    ],
    live_url: [],
    github_url: [{ id: 1, title: "Source Code", url: "#" }],
    case_study_url: [{ id: 1, title: "Case Study", url: "#" }],
    featured: true,
  },
  {
    id: 4,
    title: "Portfolio Website",
    slug: "portfolio-website",
    description:
      "A personal portfolio site built with Next.js and Tailwind CSS, featuring animated sections, dark mode, and a fully responsive layout to showcase projects and experience.",
    tech_stack: ["nextjs", "tailwindcss", "typescript"],
    thumb: {
      id: 4,
      url: PLACEHOLDER_IMAGE,
      title: "Portfolio homepage",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "Hero section" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Projects section" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Dark mode view" },
    ],
    live_url: [{ id: 1, name: "Live Demo", url: "#" }],
    github_url: [{ id: 1, title: "Source Code", url: "#" }],
    case_study_url: [],
    featured: false,
  },
  {
    id: 5,
    title: "Task Management App",
    slug: "task-management-app",
    description:
      "A collaborative task management application with boards, real-time updates, and team workspaces, built with React, Redux, and a Node.js/Express API.",
    tech_stack: ["react", "redux", "nodejs", "express", "mongodb", "typescript"],
    thumb: {
      id: 5,
      url: PLACEHOLDER_IMAGE,
      title: "Task board view",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "Kanban board" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Team workspace" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Task detail modal" },
    ],
    live_url: [{ id: 1, name: "Live Demo", url: "#" }],
    github_url: [{ id: 1, title: "Source Code", url: "#" }],
    case_study_url: [{ id: 1, title: "Case Study", url: "#" }],
    featured: false,
  },
  {
    id: 6,
    title: "Blog CMS",
    slug: "blog-cms",
    description:
      "A headless-style content management system for blogs with a markdown editor, tag-based filtering, and an admin panel, powered by Next.js, Prisma, and PostgreSQL.",
    tech_stack: ["nextjs", "prisma", "postgresql", "tailwindcss", "typescript", "react-query"],
    thumb: {
      id: 6,
      url: PLACEHOLDER_IMAGE,
      title: "Blog CMS admin panel",
    },
    image_gallery: [
      { id: 1, url: PLACEHOLDER_IMAGE, title: "Markdown editor" },
      { id: 2, url: PLACEHOLDER_IMAGE, title: "Post list & filters" },
      { id: 3, url: PLACEHOLDER_IMAGE, title: "Public blog view" },
    ],
    live_url: [{ id: 1, name: "Live Demo", url: "#" }],
    github_url: [{ id: 1, title: "Source Code", url: "#" }],
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
