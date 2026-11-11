"use client";

import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

export function OverviewCards() {
  const { netBalance, totalIncome, totalExpense, isPrivate } = useFinance();

  // Financial health ratio / savings rate
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Total Net Balance Card */}
      <Card className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 p-5 shadow-xl transition-all duration-300 hover:border-zinc-700">
        <div className="absolute -top-12 -right-12 size-36 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
              Total Saldo Bersih
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Wallet className="size-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {formatIDR(netBalance, isPrivate)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowUpRight className="size-3" />
              </span>
              <span>+14.8%</span>
              <span className="text-zinc-500 font-normal">vs bln lalu</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Sparkles className="size-3 text-amber-400" />
              <span>Rasio tabungan: <strong className="text-zinc-200">{savingsRate}%</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Income Card */}
      <Card className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 p-5 shadow-xl transition-all duration-300 hover:border-zinc-700">
        <div className="absolute -top-12 -right-12 size-36 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
              Total Pemasukan (Bulan Ini)
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-heading text-2xl font-bold tracking-tight text-emerald-400 sm:text-3xl">
              {formatIDR(totalIncome, isPrivate)}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowUpRight className="size-3" />
              </span>
              <span>+8.2%</span>
              <span className="text-zinc-500 font-normal">arus kas stabil</span>
            </div>
            <span className="text-[11px] text-zinc-500">Gaji & Freelance</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Expense Card */}
      <Card className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 p-5 shadow-xl transition-all duration-300 hover:border-zinc-700 sm:col-span-2 lg:col-span-1">
        <div className="absolute -top-12 -right-12 size-36 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />

        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
              Total Pengeluaran (Bulan Ini)
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
              <TrendingDown className="size-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-heading text-2xl font-bold tracking-tight text-rose-400 sm:text-3xl">
              {formatIDR(totalExpense, isPrivate)}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-rose-500/10">
                <ArrowDownRight className="size-3" />
              </span>
              <span>-3.5%</span>
              <span className="text-zinc-500 font-normal">pengeluaran hemat</span>
            </div>
            <span className="text-[11px] text-zinc-500">6 Kategori Aktif</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
