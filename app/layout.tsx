import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Manage cooking oil collections and inventory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
