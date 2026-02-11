import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/dashboard-nav";

export default async function ClientDetailPage({
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

  // Fetch client details
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !client) {
    notFound();
  }

  // Fetch collections for this client
  const { data: collections } = await supabase
    .from("collections")
    .select("id, collection_date, estimated_weight, actual_weight, status")
    .eq("client_id", id)
    .order("collection_date", { ascending: false });

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Client Details
              </h1>
              <p className="text-muted-foreground text-sm">
                View client information and history
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/dashboard/clients/${id}/edit`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Edit
              </Link>
              <Link
                href="/dashboard/clients"
                className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          {/* Client Information */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {client.client_name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Person
                  </p>
                  <p className="text-foreground font-medium mt-1">
                    {client.contact_person || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground mt-1">
                    {client.email ? (
                      <a
                        href={`mailto:${client.email}`}
                        className="text-primary hover:underline"
                      >
                        {client.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground mt-1">
                    {client.phone ? (
                      <a
                        href={`tel:${client.phone}`}
                        className="text-primary hover:underline"
                      >
                        {client.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="text-foreground mt-1">{client.city || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground text-sm mt-1">
                    {client.address || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-foreground mt-1">
                    {client.created_at
                      ? new Date(client.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collections History */}
          {collections && collections.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-secondary border-b border-border p-6">
                <h3 className="font-semibold text-foreground">
                  Collection History ({collections.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 font-semibold text-foreground">
                        Date
                      </th>
                      <th className="text-right px-6 py-4 font-semibold text-foreground">
                        Est. Weight
                      </th>
                      <th className="text-right px-6 py-4 font-semibold text-foreground">
                        Act. Weight
                      </th>
                      <th className="text-center px-6 py-4 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-center px-6 py-4 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection: any) => (
                      <tr
                        key={collection.id}
                        className="border-b border-border hover:bg-secondary/50 transition"
                      >
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(
                            collection.collection_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-foreground">
                          {collection.estimated_weight} kg
                        </td>
                        <td className="px-6 py-4 text-right text-foreground">
                          {collection.actual_weight} kg
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                            {collection.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/dashboard/collections/${collection.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(!collections || collections.length === 0) && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">
                No collection records for this client yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
