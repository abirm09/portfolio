"use client";

import ThemeSwitcher from "@/components/shared/header/ThemeSwitcher";
import { logoutAction } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FolderGit2,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderGit2,
    exact: false,
  },
  {
    label: "New Project",
    href: "/dashboard/projects/new",
    icon: PlusCircle,
    exact: true,
  },
  {
    label: "Media & Storage",
    href: "/dashboard/media",
    icon: ImageIcon,
    exact: true,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center p-2 rounded-lg bg-card/80 border border-border text-foreground backdrop-blur-md shadow-md"
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col justify-between border-r border-border bg-card/80 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          {/* Logo & Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight"
            >
              <div className="size-8 rounded-lg bg-linear-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
                AM
              </div>
              <span>
                Admin<span className="text-primary font-normal">Panel</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </p>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer controls: Public Site, Theme switcher, Logout */}
        <div className="p-4 border-t border-border space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Portfolio
            </span>
            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
              Tab
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <span className="text-xs text-muted-foreground">Theme</span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};
