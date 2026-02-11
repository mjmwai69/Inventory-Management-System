import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";
import ClientForm from "@/components/client-form";

export default async function NewClientPage() {
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
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">New Client</h1>
            <p className="text-muted-foreground text-sm">
              Add a new client to the system
            </p>
          </div>
        </header>

        <div className="p-8 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-8">
            <ClientForm />
          </div>
        </div>
      </main>
    </div>
  );
}
