'use client';

import { useEffect, useState } from 'react';
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

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .in('status', ['approved', 'received'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const receivedCount = verifications.filter((v) => v.status === 'received').length;
  const pendingCount = verifications.filter((v) => v.status === 'approved').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Warehouse Verification</h1>
        <p className="text-muted-foreground mt-2">Monitor delivery verification and inventory status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{receivedCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Collections in warehouse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting warehouse receipt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {verifications.reduce((sum, v) => sum + v.quantity_liters, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Liters</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>All collections by verification status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading verifications...</div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No collections to verify.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Received Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell className="font-medium">{verification.id.slice(0, 8)}</TableCell>
                    <TableCell>{verification.client_name}</TableCell>
                    <TableCell>{verification.quantity_liters}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          verification.status === 'received' ? 'default' : 'outline'
                        }
                      >
                        {verification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(verification.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {verification.warehouse_received_at
                        ? new Date(verification.warehouse_received_at).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
