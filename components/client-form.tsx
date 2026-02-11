"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ClientFormProps {
  clientId?: string;
  initialData?: Record<string, unknown>;
}

export default function ClientForm({
  clientId,
  initialData,
}: ClientFormProps) {
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
      client_name: formData.get("client_name"),
      contact_person: formData.get("contact_person"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
    };

    try {
      if (clientId) {
        const { error } = await supabase
          .from("clients")
          .update(data)
          .eq("id", clientId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("clients")
          .insert([data]);

        if (error) throw error;
      }

      router.push("/dashboard/clients");
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

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Client Name *
        </label>
        <input
          type="text"
          name="client_name"
          required
          defaultValue={initialData?.client_name as string}
          placeholder="Company name"
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Contact Person
          </label>
          <input
            type="text"
            name="contact_person"
            defaultValue={initialData?.contact_person as string}
            placeholder="Name of contact"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={initialData?.email as string}
            placeholder="email@example.com"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={initialData?.phone as string}
            placeholder="+1 (555) 123-4567"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            defaultValue={initialData?.city as string}
            placeholder="City"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Address
        </label>
        <textarea
          name="address"
          defaultValue={initialData?.address as string}
          placeholder="Street address"
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Client"}
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
