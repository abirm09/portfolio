import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Full-Stack Developer",
    company: "BrTech",
    period: "June 2025 – February 2026",
    description: "Full-time role working on scalable full-stack applications.",
    achievements: [
      "Built modern UI using Next.js",
      "Designed backend services with Node.js and Express.js",
      "Managed relational data with PostgreSQL",
      "Implemented caching and performance optimization using Redis",
    ],
    technologies: ["Next.js", "PostgreSQL", "Redis", "Node.js", "Express.js"],
  },
  {
    title: "Full-Stack Developer",
    company: "Flex-Softr (Freelance)",
    period: "October 2023 – Present",
    description: "Developed full-stack web applications for various clients.",
    achievements: [
      "Built responsive frontends using Next.js",
      "Created RESTful APIs with Node.js and Express.js",
      "Implemented authentication, database integration, and deployment",
    ],
    technologies: ["Next.js", "Node.js", "Express.js"],
  },
];

export const Experience = () => {
  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Work Experience" subtitle="My professional journey in web development" />

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={exp.title + exp.company}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 -translate-y-0.5" />

              {/* Content */}
              <div
                className={`flex-1 ml-8 md:ml-0 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  {/* Header */}
                  <div
                    className={`flex items-start gap-3 mb-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className={index % 2 === 0 ? "md:text-right" : ""}>
                      <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                  </div>

                  {/* Period */}
                  <div
                    className={`flex items-center gap-2 text-muted-foreground text-sm mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}
                  >
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <ul className={`space-y-1 mb-4 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    {exp.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="text-sm text-foreground/80 flex items-center gap-2"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-accent ${index % 2 === 0 ? "md:order-last" : ""}`}
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div
                    className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}
                  >
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
