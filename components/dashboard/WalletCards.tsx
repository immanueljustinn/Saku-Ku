"use client";

import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { WalletType } from "@/types/finance";

export function WalletCards() {
  const { wallets, isPrivate, transactions } = useFinance();

  const getWalletIcon = (name: WalletType) => {
    switch (name) {
      case "BCA Mobile":
        return <Building2 className="size-5 text-blue-400" />;
      case "SeaBank":
        return <CreditCard className="size-5 text-orange-400" />;
      case "DANA":
        return <Smartphone className="size-5 text-sky-400" />;
      case "Tunai":
        return <Banknote className="size-5 text-emerald-400" />;
    }
  };

  const getWalletBadge = (name: WalletType) => {
    switch (name) {
      case "BCA Mobile":
        return "Bank BCA";
      case "SeaBank":
        return "Bank Digital";
      case "DANA":
        return "E-Wallet";
      case "Tunai":
        return "Cash / Tunai";
    }
  };

  const getWalletGlow = (name: WalletType) => {
    switch (name) {
      case "BCA Mobile":
        return "hover:border-blue-500/40 hover:shadow-blue-500/5";
      case "SeaBank":
        return "hover:border-orange-500/40 hover:shadow-orange-500/5";
      case "DANA":
        return "hover:border-sky-500/40 hover:shadow-sky-500/5";
      case "Tunai":
        return "hover:border-emerald-500/40 hover:shadow-emerald-500/5";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
            Dompet & Rekening Aktif
          </h2>
          <p className="text-xs text-zinc-500">
            Terhubung dengan 4 sumber saldo utama
          </p>
        </div>
        <span className="text-xs font-medium text-emerald-400">
          4 Akun Tersinkron
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {wallets.map((wallet) => {
          const txCount = transactions.filter((t) => t.wallet === wallet.name).length;

          return (
            <Card
              key={wallet.id}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/80 p-4 transition-all duration-300 hover:-translate-y-0.5 ${getWalletGlow(
                wallet.name
              )}`}
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-inner">
                      {getWalletIcon(wallet.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-sm font-semibold text-zinc-100">
                        {wallet.name}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {wallet.accountNumber}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                    {getWalletBadge(wallet.name)}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] text-zinc-500">Saldo Tersedia</span>
                  <div className="font-heading text-lg font-bold tracking-tight text-white">
                    {formatIDR(wallet.balance, isPrivate)}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2.5 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <ShieldCheck className="size-3 text-emerald-400" />
                    {txCount} Transaksi
                  </span>
                  <span className="text-zinc-400 group-hover:text-emerald-400 transition-colors flex items-center gap-0.5">
                    Detail <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
