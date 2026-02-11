"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DispatchFormProps {
  dispatchId?: string;
  initialData?: Record<string, unknown>;
}

export default function DispatchForm({
  dispatchId,
  initialData,
}: DispatchFormProps) {
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
      dispatch_reference: formData.get("dispatch_reference"),
      dispatch_date: formData.get("dispatch_date"),
      buyer_partner_name: formData.get("buyer_partner_name"),
      buyer_partner_contact: formData.get("buyer_partner_contact"),
      quantity_dispatched: parseFloat(
        formData.get("quantity_dispatched") as string
      ),
      unit: formData.get("unit"),
      transport_reference: formData.get("transport_reference"),
    };

    try {
      if (dispatchId) {
        const { error } = await supabase
          .from("sales_dispatch")
          .update(data)
          .eq("id", dispatchId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sales_dispatch")
          .insert([data]);

        if (error) throw error;
      }

      router.push("/dashboard/dispatches");
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
            Dispatch Reference *
          </label>
          <input
            type="text"
            name="dispatch_reference"
            required
            defaultValue={initialData?.dispatch_reference as string}
            placeholder="e.g., DISP-2024-001"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Dispatch Date *
          </label>
          <input
            type="date"
            name="dispatch_date"
            required
            defaultValue={initialData?.dispatch_date as string}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Buyer Partner Name *
        </label>
        <input
          type="text"
          name="buyer_partner_name"
          required
          defaultValue={initialData?.buyer_partner_name as string}
          placeholder="Company name"
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Buyer Partner Contact *
        </label>
        <input
          type="text"
          name="buyer_partner_contact"
          required
          defaultValue={initialData?.buyer_partner_contact as string}
          placeholder="Phone number or email"
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quantity Dispatched *
          </label>
          <input
            type="number"
            name="quantity_dispatched"
            step="0.01"
            required
            defaultValue={initialData?.quantity_dispatched as string}
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Transport Reference *
          </label>
          <input
            type="text"
            name="transport_reference"
            required
            defaultValue={initialData?.transport_reference as string}
            placeholder="e.g., TRUCK-001"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Dispatch"}
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
