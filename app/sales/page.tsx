'use client';

import { useEffect, useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/auth';
import { NewSalesOrderDialog } from '@/components/sales/new-sales-order-dialog';

export default function SalesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [warehouseInventory, setWarehouseInventory] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, inventoryRes] = await Promise.all([
        supabase
          .from('sales_dispatch')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('warehouse_inventory').select('quantity_liters'),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (inventoryRes.error) throw inventoryRes.error;

      setOrders(ordersRes.data || []);
      const totalInventory = inventoryRes.data?.reduce(
        (sum, item) => sum + (item.quantity_liters || 0),
        0
      ) || 0;
      setWarehouseInventory(totalInventory);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      dispatched: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground mt-2">Create and manage sales orders for warehouse inventory</p>
        </div>
        <Button onClick={() => setShowDialog(true)} disabled={warehouseInventory === 0}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Available Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{warehouseInventory.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2">Liters available for sale</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
          <CardDescription>All sales orders and dispatch records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading sales orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sales orders yet. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>{order.quantity_liters}</TableCell>
                    <TableCell>${order.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${(order.quantity_liters * order.unit_price).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewSalesOrderDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSuccess={fetchData}
        availableInventory={warehouseInventory}
      />
    </div>
  );
}
