"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { WalletType } from "@/types/finance";
import { formatIDR } from "@/lib/formatters";
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
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WALLET_LIST: WalletType[] = ["BCA Mobile", "SeaBank", "DANA", "Tunai"];

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const { wallets, transferFunds, isPrivate } = useFinance();

  const [fromWallet, setFromWallet] = useState<WalletType>("BCA Mobile");
  const [toWallet, setToWallet] = useState<WalletType>("DANA");
  const [amountRaw, setAmountRaw] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sourceWalletObj = wallets.find((w) => w.name === fromWallet);
  const targetWalletObj = wallets.find((w) => w.name === toWallet);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setAmountRaw("");
      return;
    }
    const num = parseInt(raw, 10);
    setAmountRaw(new Intl.NumberFormat("id-ID").format(num));
    setError("");
  };

  const handleSwap = () => {
    setFromWallet(toWallet);
    setToWallet(fromWallet);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountRaw.replace(/\D/g, ""), 10);

    if (fromWallet === toWallet) {
      setError("Dompet asal dan tujuan tidak boleh sama");
      return;
    }

    if (!cleanAmount || cleanAmount <= 0) {
      setError("Silakan masukkan nominal transfer yang valid");
      return;
    }

    if (sourceWalletObj && sourceWalletObj.balance < cleanAmount) {
      setError(
        `Saldo ${fromWallet} tidak mencukupi (Tersedia: ${formatIDR(
          sourceWalletObj.balance,
          isPrivate
        )})`
      );
      return;
    }

    const success = transferFunds(fromWallet, toWallet, cleanAmount);
    if (success) {
      setAmountRaw("");
      setError("");
      onOpenChange(false);
    } else {
      setError("Gagal memproses transfer. Periksa saldo dompet.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 text-zinc-100 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <ArrowRightLeft className="size-4" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold text-white">
              Transfer Antar Dompet
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Pindahkan saldo antar rekening bank, dompet digital, atau uang tunai tanpa biaya.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {/* Transfer Flow Visual Cards */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* From Wallet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-zinc-400">
                  Dari Sumber
                </span>
                <select
                  value={fromWallet}
                  onChange={(e) => {
                    setFromWallet(e.target.value as WalletType);
                    setError("");
                  }}
                  className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-200 outline-none focus:border-emerald-500"
                >
                  {WALLET_LIST.map((w) => (
                    <option key={w} value={w} className="bg-zinc-900 text-white">
                      {w}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-zinc-500">
                  Saldo:{" "}
                  <strong className="text-zinc-300 font-medium">
                    {formatIDR(sourceWalletObj?.balance || 0, isPrivate)}
                  </strong>
                </div>
              </div>

              {/* To Wallet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-zinc-400">
                  Tujuan Masuk
                </span>
                <select
                  value={toWallet}
                  onChange={(e) => {
                    setToWallet(e.target.value as WalletType);
                    setError("");
                  }}
                  className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-semibold text-zinc-200 outline-none focus:border-emerald-500"
                >
                  {WALLET_LIST.map((w) => (
                    <option key={w} value={w} className="bg-zinc-900 text-white">
                      {w}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-zinc-500">
                  Saldo:{" "}
                  <strong className="text-zinc-300 font-medium">
                    {formatIDR(targetWalletObj?.balance || 0, isPrivate)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Swap Button */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-800/80 px-3 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                <ArrowRightLeft className="size-3 text-emerald-400" />
                Tukar Posisi
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Nominal Transfer (Rp) <span className="text-rose-400">*</span>
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
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950/90 pl-11 font-mono text-base font-bold text-white placeholder:text-zinc-600 focus-visible:border-sky-500 focus-visible:ring-sky-500/20"
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[50000, 100000, 250000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmountRaw(new Intl.NumberFormat("id-ID").format(preset));
                  setError("");
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] font-mono text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                +{preset.toLocaleString("id-ID")}
              </button>
            ))}
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
              className="h-10 gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-sky-500"
            >
              <CheckCircle2 className="size-4" />
              Konfirmasi Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
