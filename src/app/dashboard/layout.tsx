import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard — Portfolio Management",
  description: "Manage portfolio projects, storage, and assets with Supabase.",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
