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
    "Authentication Systems",
    "Fingerprint Authentication",
    "AI Assistants",
    "Automation",
    "Open Source",
    "Building Digital Products",
    "Theme Development",
    "SaaS Applications",
  ];

  return (
    <SectionWrapper id="about" className="section-bg-about">
      <SectionTitle
        title="About Me"
        subtitle="// Passionate developer dedicated to creating exceptional digital experiences"
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Bio */}
        <div className="space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            I&apos;m a passionate <strong>Full Stack Developer</strong> who enjoys building scalable
            web applications, APIs, SaaS products, and modern user experiences. I love learning new
            technologies and continuously improving my development skills.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I specialize in the <strong className="text-foreground">MERN stack</strong> and modern
            backends with <strong className="text-foreground">Node.js, Express, FastAPI</strong> and
            Python, working with PostgreSQL, MongoDB and Prisma. I&apos;m especially interested in
            authentication systems, backend architecture, and AI-powered tools.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I enjoy solving real-world problems through software, contributing to open source, and
            building digital products that make an impact.
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 pt-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="text-xs font-medium px-3 py-1.5 rounded-lg card-glass text-muted-foreground transition-all duration-300"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}

        {/* Profile Image Section */}
        <div className="flex justify-center items-center">
          <div className="relative rounded-2xl p-[2px] bg-[linear-gradient(135deg,var(--primary),var(--accent))] shadow-2xl shadow-primary/25">
            <div className="absolute -inset-6 -z-10 rounded-full bg-primary/20 blur-3xl overflow-hidden" />
            <Image
              src={meWhite}
              alt="Profile"
              className="dark:hidden rounded-2xl size-96 object-cover"
              priority
            />
            <Image
              src={meDark}
              alt="Profile Dark"
              className="hidden dark:block rounded-2xl size-96 object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
