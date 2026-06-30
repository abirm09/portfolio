import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Code2, Database, Server, Wrench } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    skills: ["Node.js", "Express", "REST APIs", "GraphQL"],
  },
  {
    title: "Databases",
    icon: Database,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    skills: ["MongoDB", "PostgreSQL", "Prisma", "Redis"],
  },
  {
    title: "Tools & DevOps",
    icon: Wrench,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    skills: ["Git", "Docker", "AWS", "Vercel", "Linux"],
  },
];

export const Skills = () => {
  return (
    <SectionWrapper id="skills">
      <SectionTitle
        title="Skills & Technologies"
        subtitle="Technologies I work with to bring ideas to life"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, index) => (
          <div
            key={category.title}
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}
            >
              <category.icon className={`w-6 h-6 ${category.color}`} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-4">{category.title}</h3>

            {/* Skills list */}
            <ul className="space-y-2">
              {category.skills.map((skill) => (
                <li key={skill} className="text-muted-foreground text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
