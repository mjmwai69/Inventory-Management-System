import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/dashboard-nav";
import DispatchesTable from "@/components/dispatches-table";

export default async function DispatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch dispatches
  const { data: dispatches, error } = await supabase
    .from("sales_dispatch")
    .select("*")
    .order("dispatch_date", { ascending: false });

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Sales Dispatches
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage product dispatches to buyers
              </p>
            </div>
            <Link
              href="/dashboard/dispatches/new"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              New Dispatch
            </Link>
          </div>
        </header>

        <div className="p-8">
          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Error loading dispatches: {error.message}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <DispatchesTable dispatches={dispatches || []} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
