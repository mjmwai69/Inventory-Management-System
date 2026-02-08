'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface PendingCollection {
  id: string;
  client_name: string;
  quantity_liters: number;
  created_at: string;
}

export default function CollectionReviewPage() {
  const [collections, setCollections] = useState<PendingCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    collectionId: string | null;
    pricePerLiter?: number;
  }>({
    open: false,
    action: null,
    collectionId: null,
  });
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    fetchPendingCollections();
  }, []);

  const fetchPendingCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!alertDialog.collectionId || !alertDialog.action) return;

    try {
      const updates: any = {
        status: alertDialog.action === 'approve' ? 'approved' : 'rejected',
      };

      if (alertDialog.action === 'approve' && alertDialog.pricePerLiter) {
        updates.price_per_liter = alertDialog.pricePerLiter;
      }

      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', alertDialog.collectionId);

      if (error) throw error;

      setAlertDialog({ open: false, action: null, collectionId: null });
      setPriceInput('');
      fetchPendingCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const openDialog = (action: 'approve' | 'reject', collectionId: string) => {
    setAlertDialog({
      open: true,
      action,
      collectionId,
    });
    setPriceInput('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Review Collections</h1>
        <p className="text-muted-foreground mt-2">Finance team: approve or reject pending collections</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Collections</CardTitle>
          <CardDescription>Collections awaiting finance approval</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading pending collections...</div>
          ) : collections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending collections to review.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.id.slice(0, 8)}</TableCell>
                    <TableCell>{collection.client_name}</TableCell>
                    <TableCell>{collection.quantity_liters}</TableCell>
                    <TableCell>{new Date(collection.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 bg-transparent"
                        onClick={() => openDialog('approve', collection.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => openDialog('reject', collection.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertDialog.action === 'approve' ? 'Approve Collection' : 'Reject Collection'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.action === 'approve'
                ? 'Enter the price per liter for this collection'
                : 'Are you sure you want to reject this collection?'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {alertDialog.action === 'approve' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price per Liter (USD)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                step="0.01"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (alertDialog.action === 'approve' && priceInput) {
                  setAlertDialog({
                    ...alertDialog,
                    pricePerLiter: parseFloat(priceInput),
                  });
                }
                handleReview();
              }}
              disabled={alertDialog.action === 'approve' && !priceInput}
            >
              {alertDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
