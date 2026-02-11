"use client";

import { formatDate } from "@/lib/utils";

interface InventoryItem {
  id: string;
  collection_id: string;
  quantity_added: number;
  added_at: string;
  unit: string;
  collections: {
    id: string;
    clients: {
      client_name: string;
    };
  };
}

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export default function InventoryTable({ inventory }: InventoryTableProps) {
  if (inventory.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No inventory items yet</p>
      </div>
    );
  }

  // Calculate totals by unit
  const totals = inventory.reduce(
    (acc, item) => {
      const key = item.unit;
      acc[key] = (acc[key] || 0) + item.quantity_added;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <div className="p-6 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Total Inventory
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(totals).map(([unit, total]) => (
            <div key={unit} className="bg-card rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Client
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Collection ID
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                Quantity
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Unit
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Date Added
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-secondary/50 transition"
              >
                <td className="px-6 py-4 text-sm text-foreground">
                  {item.collections?.clients?.client_name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {item.collection_id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-foreground">
                  {item.quantity_added}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.unit}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(item.added_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
