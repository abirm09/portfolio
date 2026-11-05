import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ArrowUpRight, Bot, Code2, Database, Server, Smartphone, Wrench } from "lucide-react";
import Link from "next/link";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    description: "Fast, accessible interfaces built for real people.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "TanStack Query"],
  },
  {
    title: "Backend",
    icon: Server,
    description: "Reliable services and the logic behind complex products.",
    skills: ["Node.js", "Express", "NestJS", "REST APIs", "Zod", "BullMQ"],
  },
  {
    title: "Data & Cloud",
    icon: Database,
    description: "Storage, caching, and connected data that scale.",
    skills: ["PostgreSQL", "Prisma", "Redis", "MongoDB", "Supabase"],
  },
  {
    title: "Mobile Applications",
    icon: Smartphone,
    description: "Native mobile experiences with a shared product mindset.",
    skills: ["React Native", "Expo", "React Navigation", "NativeWind"],
  },
  {
    title: "AI Integrations",
    icon: Bot,
    description: "Practical AI features connected to useful workflows.",
    skills: ["LangChain", "LLM API Integrations", "AI Assistants"],
  },
  {
    title: "Platforms & Architecture",
    icon: Wrench,
    description: "The delivery and architecture behind production systems.",
    skills: [
      "Turborepo",
      "Docker",
      "AWS",
      "S3 Storage",
      "Multi-tenant Systems",
      "E-commerce & POS",
      "GitHub Actions",
    ],
  },
];

export const Skills = () => {
  return (
    <SectionWrapper id="skills" className="section-bg-skills">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-16">
        <div className="self-start lg:sticky lg:top-28">
          <p className="text-primary mb-5 text-xs font-semibold tracking-[0.2em] uppercase">
            01 / Capabilities
          </p>
          <SectionTitle
            title="Skills & technologies"
            subtitle="The tools and systems I use to turn ideas into dependable digital products."
            align="left"
            className="mb-6"
          />
          <Link
            href="/projects"
            className="text-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            See these skills in action <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="border-border border-t">
          {skillCategories.map((category, index) => (
            <li
              key={category.title}
              className="group border-border hover:bg-card/70 grid grid-cols-[2rem_1fr] gap-3 border-b py-6 transition-colors sm:grid-cols-[2.5rem_3.5rem_1fr] sm:gap-4 sm:py-7"
            >
              <span className="text-muted-foreground pt-2 font-mono text-xs tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className="bg-brand-accent/45 text-primary hidden size-12 items-center justify-center rounded-xl sm:flex"
                aria-hidden="true"
              >
                <category.icon className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <span
                    className="bg-brand-accent/45 text-primary flex size-9 items-center justify-center rounded-lg sm:hidden"
                    aria-hidden="true"
                  >
                    <category.icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                    {category.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4 max-w-lg text-sm leading-relaxed">
                  {category.description}
                </p>
                <ul className="flex flex-wrap gap-2" aria-label={`${category.title} technologies`}>
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border-border bg-background text-foreground/80 rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
};
