"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface DashboardNavProps {
  user: User;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: "🏠" },
    { label: "Collections", href: "/dashboard/collections", icon: "📦" },
    { label: "Inventory", href: "/dashboard/inventory", icon: "📊" },
    { label: "Dispatches", href: "/dashboard/dispatches", icon: "🚚" },
    { label: "Clients", href: "/dashboard/clients", icon: "👥" },
    { label: "Reports", href: "/dashboard/reports", icon: "📈" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <Link href="/dashboard" className="mb-8">
        <h1 className="text-2xl font-bold text-primary">IMS</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Inventory Management
        </p>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border pt-6">
        <div className="bg-secondary rounded-lg p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Logged in as</p>
          <p className="text-sm font-semibold text-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
