import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Full-Stack Developer",
    company: "Zenpixl",
    period: "June 2025 – Present",
    description: "Building commerce, affiliate, and healthcare products across web and mobile.",
    projects: [
      {
        name: "Pixlcart",
        detail: "Multi-tenant commerce storefront, merchant dashboard, and POS.",
        technologies: ["Next.js", "Express", "PostgreSQL", "Redux Toolkit"],
      },
      {
        name: "Zenpixl CPA",
        detail: "Affiliate offers, tracking, conversions, and reporting.",
        technologies: ["Next.js", "TypeScript", "Prisma", "Redis"],
      },
      {
        name: "Nirnoy",
        detail: "Healthcare web dashboards and an Expo provider app.",
        technologies: ["Next.js", "React Native", "Expo"],
      },
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "Flex-Softr (Freelance)",
    period: "October 2023 – Present",
    description: "Developing e-commerce storefronts, dashboards, and APIs for clients.",
    projects: [
      {
        name: "Oneself / Electro-Commerce",
        detail: "Storefront, admin tools, and product and order APIs.",
        technologies: ["Next.js", "Node.js", "MongoDB", "Redux Toolkit"],
      },
    ],
  },
];

export const Experience = () => (
  <SectionWrapper id="experience" className="section-bg-experience">
    <SectionTitle
      title="Work Experience"
      subtitle="Selected work across commerce, affiliate platforms, and healthcare"
    />

    <div className="space-y-5">
      {experiences.map((experience) => (
        <article
          key={experience.company}
          className="card-glass grid gap-8 rounded-2xl p-6 md:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] md:p-8"
        >
          <div>
            <div className="bg-brand-accent/50 text-primary mb-5 flex size-11 items-center justify-center rounded-xl">
              <Briefcase className="size-5" aria-hidden="true" />
            </div>
            <h3 className="text-foreground text-xl font-semibold tracking-tight">
              {experience.title}
            </h3>
            <p className="text-primary mt-1 font-medium">{experience.company}</p>
            <p className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <Calendar className="size-4" aria-hidden="true" />
              {experience.period}
            </p>
            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
              {experience.description}
            </p>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-1 text-xs font-semibold tracking-[0.16em] uppercase">
              Selected projects
            </h4>
            <ul className="divide-border divide-y">
              {experience.projects.map((project) => (
                <li key={project.name} className="py-4 first:pt-3 last:pb-0">
                  <h5 className="text-foreground font-semibold">{project.name}</h5>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {project.detail}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <Badge key={technology} variant="outline" className="text-xs">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </SectionWrapper>
);
