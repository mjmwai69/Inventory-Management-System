"use client";

import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface DispatchItem {
  id: string;
  dispatch_reference: string;
  dispatch_date: string;
  buyer_partner_name: string;
  quantity_dispatched: number;
  unit: string;
  transport_reference: string;
  buyer_partner_contact: string;
  created_at: string;
}

interface DispatchesTableProps {
  dispatches: DispatchItem[];
}

export default function DispatchesTable({ dispatches }: DispatchesTableProps) {
  if (dispatches.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No dispatches yet</p>
        <Link
          href="/dashboard/dispatches/new"
          className="text-primary hover:underline"
        >
          Create the first one
        </Link>
      </div>
    );
  }

  // Calculate total quantity dispatched
  const totalDispatched = dispatches.reduce(
    (sum, d) => sum + d.quantity_dispatched,
    0
  );

  return (
    <>
      <div className="p-6 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">
              {dispatches.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Dispatches</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">
              {totalDispatched.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Units Dispatched</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">
              {new Set(dispatches.map((d) => d.buyer_partner_name)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Unique Buyers</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Reference
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Buyer
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Contact
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                Quantity
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Transport Ref
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Date
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {dispatches.map((dispatch) => (
              <tr
                key={dispatch.id}
                className="border-b border-border hover:bg-secondary/50 transition"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {dispatch.dispatch_reference}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {dispatch.buyer_partner_name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {dispatch.buyer_partner_contact}
                </td>
                <td className="px-6 py-4 text-sm text-right text-foreground">
                  {dispatch.quantity_dispatched} {dispatch.unit}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {dispatch.transport_reference}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(dispatch.dispatch_date)}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/dispatches/${dispatch.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
