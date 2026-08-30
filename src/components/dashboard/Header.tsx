import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: any;
  };
};

export const DashboardHeader = ({
  title,
  subtitle,
  action,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border/70">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {action && (
        <Button asChild variant="gradient" size="sm">
          <Link href={action.href} className="flex items-center gap-1.5">
            {action.icon ? (
              <action.icon className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{action.label}</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
