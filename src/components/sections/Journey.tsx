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
    title: "Building Multi-tenant Commerce",
    description: "Storefronts, merchant dashboards, POS, and shared platform services.",
    side: "right",
  },
  {
    title: "Designing Product Backends",
    description: "NestJS, PostgreSQL, Redis, queues, and commerce workflows.",
    side: "left",
  },
  {
    title: "Shipping Platform Products",
    description: "Affiliate tracking, reporting, and operational tools for real teams.",
    side: "right",
  },
];

export const Journey = () => {
  return (
    <SectionWrapper id="journey" className="section-bg-journey">
      <SectionTitle title="Experience Timeline" subtitle="// Journey" />

      <div className="relative">
        {/* Central vertical line */}
        <div className="bg-border absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" />

        <div className="flex flex-col gap-12">
          {journeyItems.map((item) => {
            const isLeft = item.side === "left";
            return (
              <div key={item.title} className="relative flex items-center">
                {/* Left side */}
                <div className="flex flex-1 justify-end pr-10">
                  {isLeft && (
                    <div className="card-glass animate-fade-in w-full max-w-xs rounded-xl p-5 text-right transition-all duration-300">
                      <h3 className="text-primary mb-1 text-base font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="bg-primary border-background shadow-primary/40 h-4 w-4 rounded-full border-4 shadow-md" />
                </div>

                {/* Right side */}
                <div className="flex flex-1 justify-start pl-10">
                  {!isLeft && (
                    <div className="card-glass animate-fade-in w-full max-w-xs rounded-xl p-5 transition-all duration-300">
                      <h3 className="text-primary mb-1 text-base font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
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
