import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Saku-Ku - Personal Finance Web App",
  description: "Kelola keuangan pribadi, multi-wallet, analitik, dan anggaran dengan mudah & aman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark h-full bg-zinc-950 text-zinc-100 antialiased font-sans">
      <body className={cn("min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/25 selection:text-emerald-300")}>
        {children}
      </body>
    </html>
  );
}
