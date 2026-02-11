"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
    >
      Logout
    </button>
  );
}
