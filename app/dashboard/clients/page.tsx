import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import ClientsTable from "@/components/clients-table";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch clients
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("client_name");

  return (
    <DashboardLayout user={user}>

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Clients</h1>
              <p className="text-muted-foreground text-sm">
                Manage your client contacts and information
              </p>
            </div>
            <Link
              href="/dashboard/clients/new"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Add Client
            </Link>
          </div>
        </header>

        <div className="p-8">
          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Error loading clients: {error.message}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <ClientsTable clients={clients || []} />
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
