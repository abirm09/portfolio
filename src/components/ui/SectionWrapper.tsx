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
    <section id={id} className={cn("border-border border-t py-20 md:py-28", className)}>
      <div className={cn("mx-auto max-w-7xl px-5 md:px-8", containerClassName)}>{children}</div>
    </section>
  );
};
