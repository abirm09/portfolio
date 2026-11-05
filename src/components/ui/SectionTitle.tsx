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
    <div className={cn("mb-9 md:mb-12", align === "center" && "text-center", className)}>
      <h2 className="text-foreground mb-3 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
        {title}
      </h2>
      <div
        className={cn(
          "bg-brand-accent mb-4 h-1 w-12 rounded-full",
          align === "center" && "mx-auto",
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "text-muted-foreground max-w-2xl text-base leading-relaxed",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
