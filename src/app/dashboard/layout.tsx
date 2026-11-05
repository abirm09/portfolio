import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard — Portfolio Management",
  description: "Manage portfolio projects, storage, and assets with Supabase.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
