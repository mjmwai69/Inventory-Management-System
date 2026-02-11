"use client";

import Link from "next/link";

interface Client {
  id: string;
  client_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  created_at?: string;
}

interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No clients yet</p>
        <Link
          href="/dashboard/clients/new"
          className="text-primary hover:underline"
        >
          Add the first client
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-foreground">
          Total Clients: {clients.length}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Client Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Contact Person
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Phone
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                City
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border hover:bg-secondary/50 transition"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {client.client_name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {client.contact_person || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {client.email || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {client.phone || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {client.city || "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
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
