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

export const DashboardHeader = ({ title, subtitle, action }: DashboardHeaderProps) => {
  return (
    <div className="border-border/70 mb-6 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      </div>

      {action && (
        <Button asChild variant="default" size="sm">
          <Link href={action.href} className="flex items-center gap-1.5">
            {action.icon ? <action.icon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{action.label}</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
