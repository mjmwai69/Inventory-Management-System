import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";
import InventoryTable from "@/components/inventory-table";

export default async function InventoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch inventory items
  const { data: inventory, error } = await supabase
    .from("warehouse_inventory")
    .select(
      `
      id,
      collection_id,
      quantity_added,
      added_at,
      unit,
      collections(id, clients(client_name))
    `
    )
    .order("added_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Warehouse Inventory
              </h1>
              <p className="text-muted-foreground text-sm">
                Track items in warehouse storage
              </p>
            </div>
          </div>
        </header>

        <div className="p-8">
          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Error loading inventory: {error.message}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <InventoryTable inventory={inventory || []} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
