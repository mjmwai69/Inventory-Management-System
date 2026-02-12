import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import CollectionsTable from "@/components/collections-table";

export default async function CollectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch collections with client names
  const { data: collections, error } = await supabase
    .from("collections")
    .select(
      `
      id,
      client_id,
      collection_date,
      estimated_weight,
      actual_weight,
      agreed_price,
      amount_paid,
      status,
      created_at,
      clients(client_name)
    `
    )
    .order("created_at", { ascending: false });

  // Fetch clients for form
  const { data: clients } = await supabase
    .from("clients")
    .select("id, client_name")
    .order("client_name");

  return (
    <DashboardLayout user={user}>

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Collections</h1>
              <p className="text-muted-foreground text-sm">
                Manage oil collection records
              </p>
            </div>
            <Link
              href="/dashboard/collections/new"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Add Collection
            </Link>
          </div>
        </header>

        <div className="p-8">
          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Error loading collections: {error.message}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <CollectionsTable
                collections={collections || []}
                clients={clients || []}
              />
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
