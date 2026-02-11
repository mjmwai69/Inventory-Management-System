import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";
import CollectionForm from "@/components/collection-form";

export default async function NewCollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch clients for the form
  const { data: clients } = await supabase
    .from("clients")
    .select("id, client_name")
    .order("client_name");

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">
              New Collection
            </h1>
            <p className="text-muted-foreground text-sm">
              Record a new oil collection
            </p>
          </div>
        </header>

        <div className="p-8 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-8">
            <CollectionForm clients={clients || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
