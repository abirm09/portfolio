import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
};

export const SectionWrapper = ({
  children,
  id,
  className = "",
  containerClassName = "",
}: SectionWrapperProps) => {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className={cn("max-w-7xl mx-auto px-3 md:px-5", containerClassName)}>{children}</div>
    </section>
  );
};
