import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import DashboardNav from "@/components/dashboard-nav";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Manage your inventory system
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Collections"
              description="View and manage oil collections"
              href="/dashboard/collections"
              icon="📦"
            />
            <DashboardCard
              title="Inventory"
              description="Track warehouse inventory"
              href="/dashboard/inventory"
              icon="📊"
            />
            <DashboardCard
              title="Dispatches"
              description="View sales dispatches"
              href="/dashboard/dispatches"
              icon="🚚"
            />
            <DashboardCard
              title="Clients"
              description="Manage client information"
              href="/dashboard/clients"
              icon="👥"
            />
            <DashboardCard
              title="Reports"
              description="View audit logs and reports"
              href="/dashboard/reports"
              icon="📈"
            />
            <DashboardCard
              title="Settings"
              description="Manage account settings"
              href="/dashboard/settings"
              icon="⚙️"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function DashboardCard({
  title,
  description,
  href,
  icon,
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Link>
  );
}
