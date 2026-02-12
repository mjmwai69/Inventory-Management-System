"use client";

import DashboardNav from "@/components/dashboard-nav";
import type { User } from "@supabase/supabase-js";

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export default function DashboardLayout({
  user,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />
      {children}
    </div>
  );
}
