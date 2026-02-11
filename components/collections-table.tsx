"use client";

import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface CollectionItem {
  id: string;
  client_id: string;
  collection_date: string;
  estimated_weight: number;
  actual_weight: number;
  agreed_price: number;
  amount_paid: number;
  status: string;
  created_at: string;
  clients: {
    client_name: string;
  };
}

interface Client {
  id: string;
  client_name: string;
}

interface CollectionsTableProps {
  collections: CollectionItem[];
  clients: Client[];
}

export default function CollectionsTable({
  collections,
  clients,
}: CollectionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "verified":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (collections.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No collections yet</p>
        <Link
          href="/dashboard/collections/new"
          className="text-primary hover:underline"
        >
          Create the first one
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
              Client
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
              Date
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
              Est. Weight (kg)
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
              Act. Weight (kg)
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
              Agreed Price
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
              Amount Paid
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
              Status
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr
              key={collection.id}
              className="border-b border-border hover:bg-secondary/50 transition"
            >
              <td className="px-6 py-4 text-sm text-foreground">
                {collection.clients?.client_name || "Unknown"}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {formatDate(collection.collection_date)}
              </td>
              <td className="px-6 py-4 text-sm text-right text-foreground">
                {collection.estimated_weight}
              </td>
              <td className="px-6 py-4 text-sm text-right text-foreground">
                {collection.actual_weight}
              </td>
              <td className="px-6 py-4 text-sm text-right text-foreground">
                ${collection.agreed_price}
              </td>
              <td className="px-6 py-4 text-sm text-right text-foreground">
                ${collection.amount_paid}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}
                >
                  {collection.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <Link
                  href={`/dashboard/collections/${collection.id}`}
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
  );
}
