'use client';

import { LogOut, LayoutDashboard, Package, DollarSign, Truck, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getMenuItems = () => {
    const common = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    const roleSpecific: Record<string, Array<{ href: string; label: string; icon: any }>> = {
      account_manager: [
        { href: '/collections', label: 'Collections', icon: Package },
        { href: '/clients', label: 'Clients', icon: Settings },
      ],
      finance_team: [
        { href: '/collections/review', label: 'Review Collections', icon: DollarSign },
        { href: '/payments', label: 'Payments', icon: DollarSign },
      ],
      warehouse_manager: [
        { href: '/warehouse', label: 'Warehouse', icon: Package },
        { href: '/verification', label: 'Verification', icon: Truck },
      ],
      sales_team: [
        { href: '/sales', label: 'Sales Orders', icon: DollarSign },
        { href: '/dispatch', label: 'Dispatch', icon: Truck },
      ],
      admin: [
        { href: '/collections', label: 'Collections', icon: Package },
        { href: '/collections/review', label: 'Review Collections', icon: DollarSign },
        { href: '/warehouse', label: 'Warehouse', icon: Package },
        { href: '/sales', label: 'Sales Orders', icon: DollarSign },
        { href: '/admin/users', label: 'Users', icon: Settings },
      ],
    };

    return [
      ...common,
      ...(roleSpecific[userRole as string] || []),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="/images/zij-log.png"
            alt="ZIJANI Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-bold text-sidebar-primary">ZIJANI</span>
        </div>
        <p className="text-sm text-sidebar-foreground/70 font-medium">{userName}</p>
        <p className="text-xs text-sidebar-foreground/50 capitalize">{userRole?.replace(/_/g, ' ')}</p>
      </div>

      <nav className="flex-1 overflow-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
