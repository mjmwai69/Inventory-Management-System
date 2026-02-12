import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";

export default async function NewDispatchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout user={user}>
      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">
              New Dispatch
            </h1>
            <p className="text-muted-foreground text-sm">
              Record a new sales dispatch
            </p>
          </div>
        </header>

        <div className="p-8 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-8">
            <p className="text-muted-foreground mb-4">
              Form features coming soon. Please use the dispatches table to manage data.
            </p>
            <Link href="/dashboard/dispatches" className="text-primary hover:underline">
              Back to Dispatches
            </Link>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
