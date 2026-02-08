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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaymentsDue = payments.reduce(
    (sum, payment) => sum + (payment.quantity_liters * (payment.price_per_liter || 0)),
    0
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Payment Processing</h1>
        <p className="text-muted-foreground mt-2">Manage payments to suppliers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalPaymentsDue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">Amount due to suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Approved for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {payments.length > 0 
                ? (payments.reduce((sum, p) => sum + p.quantity_liters, 0) / payments.length).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Liters per collection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved Collections for Payment</CardTitle>
          <CardDescription>Collections ready for supplier payment</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No approved collections pending payment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Price per L</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const total = payment.quantity_liters * (payment.price_per_liter || 0);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id.slice(0, 8)}</TableCell>
                      <TableCell>{payment.client_name}</TableCell>
                      <TableCell>{payment.quantity_liters}</TableCell>
                      <TableCell>${payment.price_per_liter?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="font-medium">${total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Ready to Pay</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
