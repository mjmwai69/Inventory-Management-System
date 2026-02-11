import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Inventory Management System
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your cooking oil collections and inventory
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/sign-up"
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition border border-border"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
