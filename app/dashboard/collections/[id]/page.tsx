import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/dashboard-nav";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function CollectionDetailPage({
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

  // Fetch collection details
  const { data: collection, error } = await supabase
    .from("collections")
    .select(
      `
      *,
      clients(client_name, contact_person, email, phone, address, city)
    `
    )
    .eq("id", id)
    .single();

  if (error || !collection) {
    notFound();
  }

  const weightDifference =
    collection.actual_weight - collection.estimated_weight;
  const paymentDifference = collection.agreed_price - collection.amount_paid;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Collection Details
              </h1>
              <p className="text-muted-foreground text-sm">
                View and manage collection information
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/dashboard/collections/${id}/edit`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Edit
              </Link>
              <Link
                href="/dashboard/collections"
                className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Client Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client Name</p>
                  <p className="text-foreground font-medium mt-1">
                    {collection.clients?.client_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="text-foreground mt-1">
                    {collection.clients?.contact_person || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground mt-1">
                    {collection.clients?.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground mt-1">
                    {collection.clients?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Collection Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Collection Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Collection Date</p>
                  <p className="text-foreground font-medium mt-1">
                    {formatDate(collection.collection_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-foreground capitalize font-medium mt-1">
                    {collection.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit</p>
                  <p className="text-foreground mt-1">{collection.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(collection.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Weight Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Weight Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Weight
                  </p>
                  <p className="text-foreground font-medium mt-1">
                    {collection.estimated_weight} {collection.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actual Weight</p>
                  <p className="text-foreground font-medium mt-1">
                    {collection.actual_weight} {collection.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difference</p>
                  <p
                    className={`font-medium mt-1 ${
                      weightDifference > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {weightDifference > 0 ? "+" : ""}
                    {weightDifference} {collection.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Agreed Price</p>
                  <p className="text-foreground font-medium mt-1">
                    {formatCurrency(collection.agreed_price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-foreground font-medium mt-1">
                    {formatCurrency(collection.amount_paid)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p
                    className={`font-medium mt-1 ${
                      paymentDifference > 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {formatCurrency(paymentDifference)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(collection.delivery_note ||
            collection.warehouse_notes ||
            collection.finance_notes) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {collection.delivery_note && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Delivery Note
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {collection.delivery_note}
                  </p>
                </div>
              )}
              {collection.warehouse_notes && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Warehouse Notes
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {collection.warehouse_notes}
                  </p>
                </div>
              )}
              {collection.finance_notes && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Finance Notes
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {collection.finance_notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
