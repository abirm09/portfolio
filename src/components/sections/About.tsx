import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Briefcase, Code2, Layers } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "3+ Years",
      description: "Professional Experience",
    },
    {
      icon: Layers,
      title: "Full Stack",
      description: "End-to-end Development",
    },
    {
      icon: Briefcase,
      title: "10+ Projects",
      description: "Successfully Delivered",
    },
  ];

  return (
    <SectionWrapper id="about" className="bg-secondary/30">
      <SectionTitle
        title="About Me"
        subtitle="Passionate developer dedicated to creating exceptional digital experiences"
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Bio */}
        <div className="space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            I&apos;m a <strong>Full Stack Web Developer</strong> with over 3 years of experience
            building modern, scalable web applications. My journey started with a curiosity for how
            things work on the web, and it has evolved into a passion for creating seamless user
            experiences.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I specialize in the <strong className="text-foreground">MERN stack</strong> (MongoDB,
            Express, React, Node.js) and have expanded my expertise to include Next.js, PostgreSQL,
            and modern DevOps practices. I believe in writing clean, maintainable code and staying
            up-to-date with the latest industry trends.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing
            to open-source projects, or sharing knowledge with the developer community.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid gap-4">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
