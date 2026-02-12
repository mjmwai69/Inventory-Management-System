import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { formatDate } from "@/lib/utils";

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch dispatch details
  const { data: dispatch, error } = await supabase
    .from("sales_dispatch")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !dispatch) {
    notFound();
  }

  // Fetch related dispatch items
  const { data: dispatchItems } = await supabase
    .from("dispatch_items")
    .select(
      `
      id,
      collection_id,
      quantity_from_collection,
      unit,
      collections(id, clients(client_name))
    `
    )
    .eq("dispatch_id", id);

  return (
    <DashboardLayout user={user}>

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dispatch Details
              </h1>
              <p className="text-muted-foreground text-sm">
                View dispatch information
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/dashboard/dispatches/${id}/edit`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Edit
              </Link>
              <Link
                href="/dashboard/dispatches"
                className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dispatch Header Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Dispatch Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dispatch Reference
                  </p>
                  <p className="text-foreground font-medium mt-1">
                    {dispatch.dispatch_reference}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dispatch Date
                  </p>
                  <p className="text-foreground mt-1">
                    {formatDate(dispatch.dispatch_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-foreground text-sm mt-1">
                    {formatDate(dispatch.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Buyer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Buyer Partner Name
                  </p>
                  <p className="text-foreground font-medium mt-1">
                    {dispatch.buyer_partner_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="text-foreground mt-1">
                    {dispatch.buyer_partner_contact}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Shipment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-foreground font-medium mt-1">
                    {dispatch.quantity_dispatched} {dispatch.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit</p>
                  <p className="text-foreground mt-1">{dispatch.unit}</p>
                </div>
              </div>
            </div>

            {/* Transport Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Transport Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Transport Reference
                  </p>
                  <p className="text-foreground font-mono text-sm mt-1">
                    {dispatch.transport_reference}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Items */}
          {dispatchItems && dispatchItems.length > 0 && (
            <div className="mt-8 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Items from Collections
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">
                        Collection
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">
                        Client
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-foreground">
                        Quantity
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">
                        Unit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchItems.map((item: any) => (
                      <tr
                        key={item.id}
                        className="border-b border-border hover:bg-secondary/50"
                      >
                        <td className="px-4 py-3 text-muted-foreground font-mono">
                          {item.collection_id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.collections?.clients?.client_name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          {item.quantity_from_collection}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
