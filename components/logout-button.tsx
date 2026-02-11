"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  variant?: "default" | "destructive";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const buttonClass =
    variant === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : "bg-destructive text-destructive-foreground";

  return (
    <button
      onClick={handleLogout}
      className={`${buttonClass} px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition`}
    >
      Logout
    </button>
  );
}
