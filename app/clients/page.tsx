'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import { supabase } from '@/lib/auth';
import { NewClientDialog } from '@/components/clients/new-client-dialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  collections_count: number;
  total_liters: number;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('client_name, id, quantity_liters, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by client name and aggregate
      const clientMap = new Map<string, any>();
      data?.forEach((collection: any) => {
        if (!clientMap.has(collection.client_name)) {
          clientMap.set(collection.client_name, {
            name: collection.client_name,
            collections_count: 0,
            total_liters: 0,
          });
        }
        const client = clientMap.get(collection.client_name);
        client.collections_count += 1;
        client.total_liters += collection.quantity_liters;
      });

      setClients(Array.from(clientMap.values()));
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2">Manage cooking oil collection clients</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clients.reduce((sum, c) => sum + c.collections_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clients.reduce((sum, c) => sum + c.total_liters, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Liters collected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>All clients and their collection history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No clients yet. Add one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Total Volume (L)</TableHead>
                  <TableHead>Avg Collection (L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.name}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.collections_count}</TableCell>
                    <TableCell>{client.total_liters.toLocaleString()}</TableCell>
                    <TableCell>
                      {(client.total_liters / client.collections_count).toFixed(0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewClientDialog 
        open={showDialog}
        onOpenChange={setShowDialog}
        onSuccess={fetchClients}
      />
    </div>
  );
}
