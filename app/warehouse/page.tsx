'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WarehousePage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [approvedCollections, setApprovedCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, collectionsRes] = await Promise.all([
        supabase.from('warehouse_inventory').select('*').order('created_at', { ascending: false }),
        supabase
          .from('collections')
          .select('*')
          .eq('status', 'approved')
          .is('warehouse_received_at', null)
          .order('created_at', { ascending: true }),
      ]);

      if (inventoryRes.error) throw inventoryRes.error;
      if (collectionsRes.error) throw collectionsRes.error;

      setInventory(inventoryRes.data || []);
      setApprovedCollections(collectionsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const receiveCollection = async (collectionId: string, quantityLiters: number) => {
    try {
      // Update collection status
      const { error: updateError } = await supabase
        .from('collections')
        .update({
          status: 'received',
          warehouse_received_at: new Date().toISOString(),
        })
        .eq('id', collectionId);

      if (updateError) throw updateError;

      // Add to warehouse inventory
      const { error: insertError } = await supabase.from('warehouse_inventory').insert([
        {
          quantity_liters: quantityLiters,
          collection_id: collectionId,
          received_date: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      setError('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to receive collection');
    }
  };

  const totalInventory = inventory.reduce((sum, item) => sum + (item.quantity_liters || 0), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Warehouse Management</h1>
        <p className="text-muted-foreground mt-2">Verify deliveries and manage inventory</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInventory.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Liters in warehouse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{approvedCollections.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting receipt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Received Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {inventory.filter(i => {
                const today = new Date().toDateString();
                const itemDate = new Date(i.received_date).toDateString();
                return today === itemDate;
              }).reduce((sum, i) => sum + i.quantity_liters, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Liters</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Deliveries</CardTitle>
            <CardDescription>Approved collections ready to receive</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : approvedCollections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending deliveries</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Quantity (L)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.id.slice(0, 8)}</TableCell>
                      <TableCell>{collection.client_name}</TableCell>
                      <TableCell>{collection.quantity_liters}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => receiveCollection(collection.id, collection.quantity_liters)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Receive
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>All items currently in warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Warehouse is empty</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Quantity (L)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.received_date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.quantity_liters}</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
