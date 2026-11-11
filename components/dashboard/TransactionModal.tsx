"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { TransactionType, Category, WalletType } from "@/types/finance";
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
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  Tag,
  Wallet,
} from "lucide-react";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXPENSE_CATEGORIES: Category[] = [
  "Makanan",
  "Transportasi",
  "Tagihan",
  "Hiburan",
  "Belanja",
  "Kesehatan",
  "Lainnya",
];

const INCOME_CATEGORIES: Category[] = [
  "Gaji",
  "Uang Saku",
  "Freelance",
  "Investasi",
  "Lainnya",
];

const WALLET_OPTIONS: WalletType[] = [
  "BCA Mobile",
  "SeaBank",
  "DANA",
  "Tunai",
];

export function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>("expense");
  const [amountRaw, setAmountRaw] = useState<string>("");
  const [category, setCategory] = useState<Category>("Makanan");
  const [wallet, setWallet] = useState<WalletType>("BCA Mobile");
  const [date, setDate] = useState<string>("2026-11-11");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");

  React.useEffect(() => {
    try {
      setDate(new Date().toISOString().split("T")[0]);
    } catch {
      // fallback
    }
  }, []);

  // Handle formatted amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (!rawVal) {
      setAmountRaw("");
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountRaw(new Intl.NumberFormat("id-ID").format(num));
    setError("");
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === "expense") {
      setCategory("Makanan");
    } else {
      setCategory("Gaji");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountRaw.replace(/\D/g, ""), 10);

    if (!cleanAmount || cleanAmount <= 0) {
      setError("Silakan masukkan nominal transaksi yang valid");
      return;
    }

    if (!note.trim()) {
      setError("Silakan isi catatan atau keterangan transaksi");
      return;
    }

    addTransaction({
      type,
      amount: cleanAmount,
      category,
      wallet,
      date: new Date(date).toISOString(),
      note: note.trim(),
    });

    // Reset Form
    setAmountRaw("");
    setNote("");
    setError("");
    onOpenChange(false);
  };

  const activeCategories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 text-zinc-100 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-heading text-xl font-bold text-white">
            Catat Transaksi Baru
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Perbarui pencatatan arus kas dan anggaran dompetmu secara real-time.
          </DialogDescription>
        </DialogHeader>

        {/* Expense vs Income Type Switcher */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              type === "expense"
                ? "bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ArrowDownLeft className="size-4" />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              type === "income"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ArrowUpRight className="size-4" />
            Pemasukan
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nominal / Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Nominal (Rp) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-zinc-400">
                Rp
              </span>
              <Input
                type="text"
                value={amountRaw}
                onChange={handleAmountChange}
                placeholder="0"
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950/90 pl-11 font-mono text-base font-bold text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Kategori Transaksi <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="h-10 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/90 px-3.5 text-xs font-medium text-zinc-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                {activeCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-900 py-1 text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Tag className="size-3.5" />
              </div>
            </div>
          </div>

          {/* Wallet / Source Account Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Sumber Dompet / Rekening <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value as WalletType)}
                className="h-10 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/90 px-3.5 text-xs font-medium text-zinc-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                {WALLET_OPTIONS.map((w) => (
                  <option key={w} value={w} className="bg-zinc-900 py-1 text-white">
                    {w}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Wallet className="size-3.5" />
              </div>
            </div>
          </div>

          {/* Date Picker Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 rounded-xl border-zinc-800 bg-zinc-950/90 text-xs font-medium text-white scheme-dark focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Note / Keterangan */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Catatan / Keterangan <span className="text-rose-400">*</span>
            </label>
            <Input
              type="text"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError("");
              }}
              placeholder="Contoh: Belanja bahan dapur mingguan..."
              className="h-10 rounded-xl border-zinc-800 bg-zinc-950/90 text-xs text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Batal
            </button>
            <Button
              type="submit"
              className="h-10 gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 text-xs font-semibold text-zinc-950 hover:from-emerald-400 hover:to-emerald-500 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="size-4" />
              Simpan Transaksi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
