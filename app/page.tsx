"use client";

import React, { useState } from "react";
import { FinanceProvider } from "@/context/FinanceContext";
import { Header } from "@/components/dashboard/Header";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { WalletCards } from "@/components/dashboard/WalletCards";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* 1. Header & Navigation */}
      <Header onOpenTransactionModal={() => setIsModalOpen(true)} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Greeting & Quick Status */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Dashboard Keuangan Pribadi
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <Sparkles className="size-3" />
                Live Demo
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Pantau arus kas, realisasi anggaran bulanan, dan saldo dompet secara terpadu.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Koneksi Perbankan Aktif</span>
          </div>
        </div>

        {/* 2. Financial Overview Cards */}
        <section aria-label="Financial Overview">
          <OverviewCards />
        </section>

        {/* 3. Multi-Wallet Grid */}
        <section aria-label="Multi-Wallet Overview">
          <WalletCards />
        </section>

        {/* 4. Split Grid: Analytics Chart & History (Left) | Budgets & Wellness (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (2 Cols on lg) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Interactive Analytics Chart */}
            <section aria-label="Cash Flow Analytics">
              <AnalyticsChart />
            </section>

            {/* Recent Transaction History */}
            <section aria-label="Transaction History">
              <TransactionHistory />
            </section>
          </div>

          {/* Right Column (1 Col on lg) */}
          <div className="space-y-6">
            {/* Budget Limit & Overbudget Alerts */}
            <section aria-label="Budget Limits">
              <BudgetOverview />
            </section>

            {/* Financial Tips & Pro Features Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-5 shadow-xl">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 size-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Zap className="size-4" />
                Tips Hemat FinTrack
              </div>
              <h3 className="mt-2 text-sm font-bold text-white">
                Optimalkan Anggaran Hiburan Anda
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Pengeluaran kategori Hiburan telah melebihi batas 100%. Pertimbangkan untuk mengalihkan pengeluaran rekreasi akhir pekan ke aktivitas hemat energi minggu ini.
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Privasi & Enkripsi Data
                </span>
                <span className="font-mono text-zinc-400">256-bit AES</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Saku-Ku. Hak Cipta Dilindungi.
          </span>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Next.js 16</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>shadcn/ui</span>
          </div>
        </div>
      </footer>

      {/* 5. Catat Transaksi Modal */}
      <TransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
