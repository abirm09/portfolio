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
        className="bg-card/80 border-border text-foreground fixed top-4 left-4 z-50 flex items-center justify-center rounded-lg border p-2 shadow-md backdrop-blur-md md:hidden"
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
          "border-border bg-card/80 fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          {/* Logo & Brand */}
          <div className="border-border flex h-16 items-center justify-between border-b px-6">
            <Link
              href="/dashboard"
              className="text-foreground flex items-center gap-2.5 text-lg font-bold tracking-tight"
            >
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-black">
                AM
              </div>
              <span>
                Admin<span className="text-primary font-normal">Panel</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 p-4">
            <p className="text-muted-foreground px-3 py-2 text-[11px] font-semibold tracking-wider uppercase">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary text-primary-foreground shadow-primary/25 font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer controls: Public Site, Theme switcher, Logout */}
        <div className="border-border space-y-3 border-t p-4">
          <Link
            href="/"
            target="_blank"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Portfolio
            </span>
            <span className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
              Tab
            </span>
          </Link>

          <div className="border-border/50 flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <span className="text-muted-foreground text-xs">Theme</span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="text-destructive hover:bg-destructive/10 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};
