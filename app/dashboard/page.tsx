'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/auth';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCollections: 0,
    pendingReview: 0,
    warehouseInventory: 0,
    pendingSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: collectionsCount },
          { count: pendingCount },
          { data: inventoryData },
          { count: salesCount },
        ] = await Promise.all([
          supabase.from('collections').select('*', { count: 'exact', head: true }),
          supabase.from('collections').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('warehouse_inventory').select('*'),
          supabase.from('sales_dispatch').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        const totalInventory = inventoryData?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

        setStats({
          totalCollections: collectionsCount || 0,
          pendingReview: pendingCount || 0,
          warehouseInventory: totalInventory,
          pendingSales: salesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">ZIJANI Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your inventory management system</p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground mt-2">All time collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting finance review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Warehouse Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.warehouseInventory.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">Liters in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.pendingSales}</div>
              <p className="text-xs text-muted-foreground mt-2">Pending dispatch</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
