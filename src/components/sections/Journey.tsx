import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const journeyItems = [
  {
    title: "Learning Web Development",
    description: "Started with the fundamentals: HTML, CSS, JavaScript.",
    side: "left",
  },
  {
    title: "Building MERN Applications",
    description: "Full stack apps with MongoDB, Express, React, Node.",
    side: "right",
  },
  {
    title: "Creating SaaS Projects",
    description: "Shipping scalable, monetized digital products.",
    side: "left",
  },
  {
    title: "Learning FastAPI",
    description: "High-performance Python backends and APIs.",
    side: "right",
  },
  {
    title: "Building Authentication Systems",
    description: "JWT, biometric & fingerprint authentication.",
    side: "left",
  },
  {
    title: "AI & Automation",
    description: "Exploring AI engineering and local AI assistants.",
    side: "right",
  },
];

export const Journey = () => {
  return (
    <SectionWrapper id="journey" className="section-bg-journey">
      <SectionTitle title="Experience Timeline" subtitle="// Journey" />

      <div className="relative">
        {/* Central vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        <div className="flex flex-col gap-12">
          {journeyItems.map((item) => {
            const isLeft = item.side === "left";
            return (
              <div key={item.title} className="relative flex items-center">
                {/* Left side */}
                <div className="flex-1 pr-10 flex justify-end">
                  {isLeft && (
                    <div className="max-w-xs w-full p-5 rounded-xl card-glass transition-all duration-300 text-right animate-fade-in">
                      <h3 className="text-base font-semibold text-primary mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md shadow-primary/40" />
                </div>

                {/* Right side */}
                <div className="flex-1 pl-10 flex justify-start">
                  {!isLeft && (
                    <div className="max-w-xs w-full p-5 rounded-xl card-glass transition-all duration-300 animate-fade-in">
                      <h3 className="text-base font-semibold text-primary mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};
