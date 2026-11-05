import meDark from "@/assets/me-dark.webp";
import meWhite from "@/assets/me-white.webp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import Image from "next/image";

export const About = () => {
  const interests = [
    "Full Stack Development",
    "System Design",
    "Backend Architecture",
    "Multi-tenant Platforms",
    "E-commerce Systems",
    "Point of Sale",
    "Background Jobs",
    "Open Source",
    "Building Digital Products",
    "Affiliate Platforms",
    "Developer Tooling",
    "Mobile Applications",
    "AI Integrations",
  ];

  return (
    <SectionWrapper id="about" className="section-bg-about">
      <SectionTitle
        title="About Me"
        subtitle="Building useful products across commerce, SaaS, and the modern web"
      />

      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Bio */}
        <div className="space-y-6">
          <p className="text-foreground/90 text-lg leading-relaxed">
            I&apos;m a <strong>Full Stack Developer</strong> building product experiences from the
            storefront to the systems behind it. My recent work spans multi-tenant commerce,
            affiliate platforms, dashboards, and scalable web applications.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I work with <strong className="text-foreground">Next.js, React, and TypeScript</strong>{" "}
            on the frontend, and{" "}
            <strong className="text-foreground">Node.js, Express, and NestJS</strong> on the
            backend. PostgreSQL, Prisma, Redis, and Supabase help me build dependable product
            workflows.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I also work with React Native and Expo for mobile applications, and explore AI
            integrations with LangChain and LLM APIs. I enjoy solving real business problems,
            especially in payments, inventory, reporting, and growing product systems.
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 pt-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}

        {/* Profile Image Section */}
        <div className="flex items-center justify-center">
          <div className="border-brand-accent bg-brand-accent relative rounded-[1.5rem] border-[12px]">
            <Image
              src={meWhite}
              alt="Profile"
              className="size-96 rounded-2xl object-cover dark:hidden"
              priority
            />
            <Image
              src={meDark}
              alt="Profile Dark"
              className="hidden size-96 rounded-2xl object-cover dark:block"
              priority
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
