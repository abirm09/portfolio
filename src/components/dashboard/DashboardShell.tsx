"use client";

import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export const DashboardShell = ({ children }: { children: ReactNode }) => {
  const isLoginPage = usePathname() === "/dashboard/login";

  if (isLoginPage) {
    return <main className="bg-background min-h-screen">{children}</main>;
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <DashboardSidebar />
      <main className="flex min-w-0 flex-1 flex-col md:ml-64">
        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
