"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR } from "@/lib/formatters";
import { Category, BudgetLimit } from "@/types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  SlidersHorizontal,
  CheckCircle2,
  DollarSign,
  Utensils,
  Car,
  FileText,
  Film,
  ShoppingBag,
  Activity,
  Tag,
} from "lucide-react";

export function BudgetOverview() {
  const { budgets, categorySpending, isPrivate, updateBudget } = useFinance();

  // Edit budget modal state
  const [editingCategory, setEditingCategory] = useState<BudgetLimit | null>(null);
  const [newLimitRaw, setNewLimitRaw] = useState<string>("");

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
      case "Kesehatan":
        return <Activity className="size-4 text-rose-400" />;
      default:
        return <Tag className="size-4 text-zinc-400" />;
    }
  };

  const handleOpenEdit = (budget: BudgetLimit) => {
    setEditingCategory(budget);
    setNewLimitRaw(new Intl.NumberFormat("id-ID").format(budget.limit));
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const cleanNum = parseInt(newLimitRaw.replace(/\D/g, ""), 10);
    if (!isNaN(cleanNum) && cleanNum > 0) {
      updateBudget(editingCategory.category, cleanNum);
    }
    setEditingCategory(null);
  };

  // Overbudget check
  const overbudgetCategories = budgets.filter((b) => {
    const spent = categorySpending[b.category] || 0;
    return spent >= b.limit;
  });

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <SlidersHorizontal className="size-4" />
              </div>
              <CardTitle className="font-heading text-base font-bold text-white">
                Batas Anggaran & Monitoring
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Pantau batas pengeluaran bulanan agar keuangan tetap terkendali.
            </CardDescription>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {budgets.length} Kategori
          </span>
        </div>

        {/* Overbudget Global Alert Banner */}
        {overbudgetCategories.length > 0 && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-pulse">
            <AlertTriangle className="size-5 shrink-0 text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold text-rose-200">
                Peringatan Overbudget:
              </span>{" "}
              {overbudgetCategories.map((c) => c.category).join(", ")} telah
              melebihi batas anggaran!
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {budgets.map((budget) => {
          const spent = categorySpending[budget.category] || 0;
          const percentage = Math.min(
            Math.round((spent / budget.limit) * 100),
            100
          );
          const rawRatio = Math.round((spent / budget.limit) * 100);

          // Color coding logic
          // <75% Emerald, 75-99% Amber/Yellow, >=100% Rose (Overbudget)
          let statusColor = "bg-emerald-500";
          let badgeText = `${rawRatio}%`;
          let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

          if (rawRatio >= 100) {
            statusColor = "bg-rose-500";
            badgeText = `Overbudget (${rawRatio}%)`;
            badgeBg = "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold";
          } else if (rawRatio >= 75) {
            statusColor = "bg-amber-500";
            badgeText = `Hati-hati (${rawRatio}%)`;
            badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
          }

          return (
            <div
              key={budget.category}
              className="group rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3.5 transition-all hover:border-zinc-700/80 hover:bg-zinc-950/70"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                    {getCategoryIcon(budget.category)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-200">
                      {budget.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeBg}`}
                  >
                    {badgeText}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(budget)}
                    className="opacity-60 transition-opacity hover:opacity-100 p-1 text-zinc-400 hover:text-white"
                    title="Edit Batas Anggaran"
                  >
                    <SlidersHorizontal className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Numerical breakdown */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span>
                  Terpakai:{" "}
                  <strong className="text-zinc-200 font-medium">
                    {formatIDR(spent, isPrivate)}
                  </strong>
                </span>
                <span>
                  Batas:{" "}
                  <strong className="text-zinc-300 font-medium">
                    {formatIDR(budget.limit, isPrivate)}
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <Dialog
          open={!!editingCategory}
          onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}
        >
          <DialogContent className="max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg font-bold text-white">
                Atur Batas Anggaran: {editingCategory.category}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Tentukan target limit pengeluaran bulanan untuk kategori ini.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveBudget} className="mt-3 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Nominal Batas Baru (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-zinc-400">
                    Rp
                  </span>
                  <Input
                    type="text"
                    value={newLimitRaw}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/\D/g, ""), 10);
                      setNewLimitRaw(
                        isNaN(num) ? "" : new Intl.NumberFormat("id-ID").format(num)
                      );
                    }}
                    placeholder="Contoh: 2.000.000"
                    className="h-10 rounded-xl border-zinc-800 bg-zinc-950 pl-11 font-mono text-sm font-bold text-white"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="h-9 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="h-9 rounded-xl bg-emerald-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
                >
                  <CheckCircle2 className="size-3.5 mr-1.5" />
                  Simpan Batas
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
