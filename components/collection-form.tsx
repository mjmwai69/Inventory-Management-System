"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  client_name: string;
}

interface CollectionFormProps {
  clients: Client[];
  collectionId?: string;
  initialData?: Record<string, unknown>;
}

export default function CollectionForm({
  clients,
  collectionId,
  initialData,
}: CollectionFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      client_id: formData.get("client_id"),
      collection_date: formData.get("collection_date"),
      estimated_weight: parseFloat(formData.get("estimated_weight") as string),
      actual_weight: parseFloat(formData.get("actual_weight") as string),
      agreed_price: parseFloat(formData.get("agreed_price") as string),
      amount_paid: parseFloat(formData.get("amount_paid") as string),
      status: formData.get("status"),
      unit: formData.get("unit"),
      delivery_note: formData.get("delivery_note"),
      warehouse_notes: formData.get("warehouse_notes"),
      finance_notes: formData.get("finance_notes"),
    };

    try {
      if (collectionId) {
        const { error } = await supabase
          .from("collections")
          .update(data)
          .eq("id", collectionId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("collections")
          .insert([data]);

        if (error) throw error;
      }

      router.push("/dashboard/collections");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Client *
          </label>
          <select
            name="client_id"
            required
            defaultValue={initialData?.client_id as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Collection Date *
          </label>
          <input
            type="date"
            name="collection_date"
            required
            defaultValue={initialData?.collection_date as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estimated Weight (kg) *
          </label>
          <input
            type="number"
            name="estimated_weight"
            step="0.01"
            required
            defaultValue={initialData?.estimated_weight as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Actual Weight (kg) *
          </label>
          <input
            type="number"
            name="actual_weight"
            step="0.01"
            required
            defaultValue={initialData?.actual_weight as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Unit *
          </label>
          <select
            name="unit"
            required
            defaultValue={initialData?.unit as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select unit</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="liter">Liters</option>
            <option value="barrel">Barrel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Agreed Price ($) *
          </label>
          <input
            type="number"
            name="agreed_price"
            step="0.01"
            required
            defaultValue={initialData?.agreed_price as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Amount Paid ($) *
          </label>
          <input
            type="number"
            name="amount_paid"
            step="0.01"
            required
            defaultValue={initialData?.amount_paid as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Status *
        </label>
        <select
          name="status"
          required
          defaultValue={initialData?.status as string}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="verified">Verified</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Delivery Note
        </label>
        <textarea
          name="delivery_note"
          defaultValue={initialData?.delivery_note as string}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Warehouse Notes
        </label>
        <textarea
          name="warehouse_notes"
          defaultValue={initialData?.warehouse_notes as string}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Finance Notes
        </label>
        <textarea
          name="finance_notes"
          defaultValue={initialData?.finance_notes as string}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Collection"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 bg-secondary text-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
