import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch audit logs
  const { data: auditLogs, error: auditError } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch collection statistics
  const { data: collections } = await supabase
    .from("collections")
    .select("id, status, estimated_weight, actual_weight, agreed_price, amount_paid");

  // Calculate statistics
  const stats = collections
    ? {
        totalCollections: collections.length,
        totalWeight: collections.reduce(
          (sum: number, c: any) => sum + (c.actual_weight || 0),
          0
        ),
        totalRevenue: collections.reduce(
          (sum: number, c: any) => sum + (c.agreed_price || 0),
          0
        ),
        paidAmount: collections.reduce(
          (sum: number, c: any) => sum + (c.amount_paid || 0),
          0
        ),
        outstanding: collections.reduce(
          (sum: number, c: any) =>
            sum + ((c.agreed_price || 0) - (c.amount_paid || 0)),
          0
        ),
        statusBreakdown: {
          pending: collections.filter((c: any) => c.status === "pending").length,
          completed: collections.filter((c: any) => c.status === "completed").length,
          verified: collections.filter((c: any) => c.status === "verified").length,
          cancelled: collections.filter((c: any) => c.status === "cancelled").length,
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav user={user} />

      <main className="flex-1">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">
              Audit Logs & Reports
            </h1>
            <p className="text-muted-foreground text-sm">
              View system activity and generated reports
            </p>
          </div>
        </header>

        <div className="p-8">
          {/* Summary Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Collections</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalCollections}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Weight</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalWeight.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">kg</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Amount Paid</p>
                <p className="text-3xl font-bold text-green-400">
                  ${stats.paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Outstanding</p>
                <p className="text-3xl font-bold text-red-400">
                  ${stats.outstanding.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Status Breakdown */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.statusBreakdown.pending}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Pending</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {stats.statusBreakdown.completed}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Completed</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {stats.statusBreakdown.verified}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Verified</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-2xl font-bold text-gray-400">
                  {stats.statusBreakdown.cancelled}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Cancelled</p>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-secondary border-b border-border p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
            </div>

            {auditError ? (
              <div className="p-8 bg-destructive/10 text-destructive text-sm">
                Error loading audit logs: {auditError.message}
              </div>
            ) : auditLogs && auditLogs.length > 0 ? (
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {auditLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-6 hover:bg-secondary/50 transition"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground capitalize">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 break-all">
                        Collection: {log.collection_id}
                      </p>
                      {log.new_values && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Changes: {Object.keys(log.new_values).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No activity logs yet
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
