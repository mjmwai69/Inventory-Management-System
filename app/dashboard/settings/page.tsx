import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import LogoutButton from "@/components/logout-button";

export default async function SettingsPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account and preferences
            </p>
          </div>
        </header>

        <div className="p-8 max-w-2xl">
          <div className="space-y-8">
            {/* Account Information */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Account Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium mt-1">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    User ID
                  </label>
                  <p className="text-foreground font-mono text-sm mt-1 break-all">
                    {user.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Account Created
                  </label>
                  <p className="text-foreground mt-1">
                    {new Date(user.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-destructive mb-4">
                Danger Zone
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Once you log out, you&rsquo;ll need to log back in with your
                credentials.
              </p>

              <LogoutButton variant="destructive" />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
