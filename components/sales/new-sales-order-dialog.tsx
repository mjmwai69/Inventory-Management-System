'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/auth';

interface NewSalesOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  availableInventory: number;
}

export function NewSalesOrderDialog({
  open,
  onOpenChange,
  onSuccess,
  availableInventory,
}: NewSalesOrderDialogProps) {
  const [buyerName, setBuyerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = quantity && unitPrice ? (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!buyerName || !quantity || !unitPrice) {
      setError('All fields are required');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (quantityNum > availableInventory) {
      setError(`Cannot exceed available inventory of ${availableInventory} liters`);
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase.from('sales_dispatch').insert([
        {
          buyer_name: buyerName,
          quantity_liters: quantityNum,
          unit_price: parseFloat(unitPrice),
          total_price: parseFloat(totalPrice),
          status: 'pending',
          sales_team_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      setBuyerName('');
      setQuantity('');
      setUnitPrice('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sales Order</DialogTitle>
          <DialogDescription>
            Create a new sales order for cooking oil
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Buyer Name</label>
            <Input
              placeholder="Company Name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity (Liters)</label>
            <Input
              type="number"
              placeholder="1000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              required
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Available: {availableInventory.toLocaleString()} liters
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Unit Price (USD per Liter)</label>
            <Input
              type="number"
              placeholder="0.50"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              disabled={loading}
              required
              step="0.01"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-2xl font-bold">${totalPrice}</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !quantity || parseFloat(quantity) > availableInventory}>
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
