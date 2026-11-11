"use client";

import React from "react";
import Image from "next/image";
import { useFinance } from "@/context/FinanceContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Plus,
  ArrowRightLeft,
  Shield,
  LogOut,
  LogIn,
  Wallet2,
  Bell,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenTransactionModal: () => void;
  onOpenTransferModal?: () => void;
}

export function Header({ onOpenTransactionModal, onOpenTransferModal }: HeaderProps) {
  const { isPrivate, togglePrivacy, user, toggleAuth } = useFinance();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 text-zinc-950">
            <Wallet2 className="size-5 font-bold" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Saku-<span className="text-emerald-400">Ku</span>
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                v1.0
              </span>
            </div>
            <span className="hidden text-[11px] text-zinc-400 sm:inline-block">
              Intelligent Financial Management
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Balance Privacy Toggle */}
          <button
            type="button"
            onClick={togglePrivacy}
            className={`group relative flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-all duration-200 outline-none ${
              isPrivate
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                : "border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            }`}
            title={isPrivate ? "Tampilkan Saldo (Privasi Aktif)" : "Sembunyikan Saldo (Privasi Nonaktif)"}
          >
            {isPrivate ? (
              <>
                <EyeOff className="size-4 text-amber-400 transition-transform group-hover:scale-110" />
                {/* <span className="hidden md:inline">Saldo Tersembunyi</span> */}
              </>
            ) : (
              <>
                <Eye className="size-4 text-zinc-400 transition-transform group-hover:scale-110 group-hover:text-white" />
                {/* <span className="hidden md:inline">Privasi Saldo</span> */}
              </>
            )}
          </button>

          {/* Quick Transfer Button */}
          {onOpenTransferModal && (
            <button
              type="button"
              onClick={onOpenTransferModal}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 text-xs font-medium text-zinc-300 transition-all hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300 active:scale-95"
              title="Transfer Saldo Antar Dompet"
            >
              <ArrowRightLeft className="size-3.5 text-sky-400" />
              <span className="hidden sm:inline">Transfer</span>
            </button>
          )}

          {/* Quick Catat Transaksi Button */}
          <Button
            onClick={onOpenTransactionModal}
            className="h-9 gap-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-3.5 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-600/20 transition-all duration-200 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-600/30 active:scale-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Catat Transaksi</span>
            <span className="sm:hidden">Catat</span>
          </Button>

          {/* User Profile Widget */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-1 pr-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                />
              }
            >
              {/* <div className="relative size-7 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/10">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-bold text-zinc-300 text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                {user.isLoggedIn && (
                  <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-400 ring-1 ring-zinc-950" />
                )}
              </div> */}
              <div className="hidden flex-col text-left text-xs lg:flex">
                <span className="max-w-27.5 truncate font-medium text-zinc-200">
                  {user.name}
                </span>
                <span className="max-w-27.5 truncate text-[10px] text-zinc-400">
                  {user.isLoggedIn ? "Google Connected" : "Guest Mode"}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-2 text-zinc-200 shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuLabel className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="size-9 overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-zinc-700">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-zinc-400 truncate max-w-40">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1.5 bg-zinc-800" />

              <DropdownMenuGroup>
                <div className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-2">
                    <Shield className="size-3.5 text-emerald-400" />
                    Status Akun
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                    {user.isLoggedIn ? "Terverifikasi" : "Tamu"}
                  </span>
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5 bg-zinc-800" />

              <DropdownMenuItem
                onClick={toggleAuth}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                {user.isLoggedIn ? (
                  <>
                    <LogOut className="size-4 text-rose-400" />
                    <span className="text-rose-300">Sign Out dari Google</span>
                  </>
                ) : (
                  <>
                    <LogIn className="size-4 text-emerald-400" />
                    <span className="text-emerald-300">Hubungkan Akun Google</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
