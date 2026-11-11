"use client";

import React, { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR, formatDateTime } from "@/lib/formatters";
import { Category, TransactionType, WalletType } from "@/types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Trash2,
  Utensils,
  Car,
  FileText,
  Film,
  ShoppingBag,
  Briefcase,
  Laptop,
  TrendingUp,
  Activity,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Building2,
  Smartphone,
  Banknote,
  CreditCard,
} from "lucide-react";

export function TransactionHistory() {
  const { transactions, isPrivate, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "Makanan":
        return <Utensils className="size-4 text-amber-400" />;
      case "Transportasi":
        return <Car className="size-4 text-blue-400" />;
      case "Tagihan":
        return <FileText className="size-4 text-indigo-400" />;
      case "Hiburan":
        return <Film className="size-4 text-purple-400" />;
      case "Belanja":
        return <ShoppingBag className="size-4 text-pink-400" />;
      case "Gaji":
        return <Briefcase className="size-4 text-emerald-400" />;
      case "Freelance":
        return <Laptop className="size-4 text-cyan-400" />;
      case "Investasi":
        return <TrendingUp className="size-4 text-teal-400" />;
      case "Kesehatan":
        return <Activity className="size-4 text-rose-400" />;
      default:
        return <Tag className="size-4 text-zinc-400" />;
    }
  };

  const getWalletBadgeStyle = (wallet: WalletType) => {
    switch (wallet) {
      case "BCA Mobile":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "SeaBank":
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";
      case "DANA":
        return "border-sky-500/30 bg-sky-500/10 text-sky-400";
      case "Tunai":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search query filter (matches note or category)
      const matchesSearch =
        tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.wallet.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || tx.category === selectedCategory;

      // Type filter
      const matchesType = selectedType === "all" || tx.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)));
  }, [transactions]);

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-heading text-base font-bold text-white">
              Riwayat Transaksi Terbaru
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Catatan mutasi pengeluaran & pemasukan dari seluruh dompet.
            </CardDescription>
          </div>

          {/* Quick Transaction Type Switcher */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedType === "all"
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("expense")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedType === "expense"
                  ? "bg-rose-500/20 text-rose-300 font-semibold shadow-sm border border-rose-500/30"
                  : "text-zinc-400 hover:text-rose-300"
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("income")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedType === "income"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm border border-emerald-500/30"
                  : "text-zinc-400 hover:text-emerald-300"
              }`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        {/* Filter Controls: Search Bar & Category Dropdown */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi berdasarkan catatan atau kategori..."
              className="h-9 rounded-xl border-zinc-800 bg-zinc-950/80 pl-9 text-xs text-white placeholder:text-zinc-500 focus-visible:border-emerald-500"
            />
          </div>

          <div className="relative sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 text-xs font-medium text-zinc-300 transition-colors focus:border-emerald-500 focus:outline-none"
            >
              <option value="all" className="bg-zinc-900 text-white">
                Semua Kategori ({uniqueCategories.length})
              </option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <Filter className="size-3.5" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/80 py-12 text-center text-zinc-500">
            <Tag className="size-8 stroke-1 text-zinc-600 mb-2" />
            <p className="text-xs font-medium text-zinc-400">
              Tidak ada transaksi yang cocok
            </p>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Coba sesuaikan kata kunci pencarian atau filter kategori Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/40">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === "income";

              return (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-zinc-900/60"
                >
                  {/* Left: Category Icon & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                        isIncome
                          ? "border-emerald-500/20 bg-emerald-500/10"
                          : "border-zinc-800 bg-zinc-900"
                      }`}
                    >
                      {getCategoryIcon(tx.category)}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs font-semibold text-zinc-200">
                        {tx.note}
                      </span>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                        <span
                          className={`rounded-md border px-1.5 py-0.2 text-[10px] font-medium ${getWalletBadgeStyle(
                            tx.wallet
                          )}`}
                        >
                          {tx.wallet}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-400">{tx.category}</span>
                        <span>•</span>
                        <span>{formatDateTime(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Color-Coded Amount & Delete Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-mono text-xs sm:text-sm font-bold tracking-tight ${
                          isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatIDR(tx.amount, isPrivate)}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {isIncome ? "Masuk" : "Keluar"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
