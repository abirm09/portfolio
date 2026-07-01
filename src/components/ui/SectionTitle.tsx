import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
};

export const SectionTitle = ({
  title,
  subtitle,
  className = "",
  align = "center",
}: SectionTitleProps) => {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
};
