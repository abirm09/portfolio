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
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      <div
        className={cn(
          "h-1 w-16 rounded-full bg-[linear-gradient(100deg,var(--primary),var(--accent))] mb-4",
          align === "center" && "mx-auto",
        )}
      />
      {subtitle && (
        <p
          className={cn("text-muted-foreground text-sm max-w-2xl", align === "center" && "mx-auto")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
