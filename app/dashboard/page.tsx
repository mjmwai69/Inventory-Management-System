import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Inventory Management System
            </h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Collections"
            description="View and manage oil collections"
            href="/dashboard/collections"
          />
          <DashboardCard
            title="Inventory"
            description="Track warehouse inventory"
            href="/dashboard/inventory"
          />
          <DashboardCard
            title="Dispatches"
            description="View sales dispatches"
            href="/dashboard/dispatches"
          />
          <DashboardCard
            title="Clients"
            description="Manage client information"
            href="/dashboard/clients"
          />
          <DashboardCard
            title="Reports"
            description="View audit logs and reports"
            href="/dashboard/reports"
          />
          <DashboardCard
            title="Settings"
            description="Manage account settings"
            href="/dashboard/settings"
          />
        </div>
      </div>
    </main>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

function DashboardCard({ title, description, href }: DashboardCardProps) {
  return (
    <a
      href={href}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </a>
  );
}
