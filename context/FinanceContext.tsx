"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  Transaction,
  Wallet,
  BudgetLimit,
  UserProfile,
  WalletType,
  Category,
  TransactionType,
} from "@/types/finance";
import {
  INITIAL_USER,
  INITIAL_WALLETS,
  INITIAL_BUDGETS,
  INITIAL_TRANSACTIONS,
} from "@/lib/mock-data";

interface FinanceContextType {
  isPrivate: boolean;
  togglePrivacy: () => void;
  user: UserProfile;
  toggleAuth: () => void;
  wallets: Wallet[];
  transactions: Transaction[];
  budgets: BudgetLimit[];
  addTransaction: (tx: {
    type: TransactionType;
    amount: number;
    category: Category;
    wallet: WalletType;
    date: string;
    note: string;
  }) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: Category, limit: number) => void;
  transferFunds: (fromWallet: WalletType, toWallet: WalletType, amount: number) => boolean;
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  categorySpending: Record<Category, number>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [budgets, setBudgets] = useState<BudgetLimit[]>(INITIAL_BUDGETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Sync privacy mode from localStorage if available
  useEffect(() => {
    try {
      const savedPrivacy = localStorage.getItem("fintrack_privacy_mode");
      if (savedPrivacy !== null) {
        setIsPrivate(savedPrivacy === "true");
      }
    } catch {
      // ignore SSR or restricted localStorage
    }
  }, []);

  const togglePrivacy = () => {
    setIsPrivate((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("fintrack_privacy_mode", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleAuth = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: !prev.isLoggedIn,
    }));
  };

  const addTransaction = (txData: {
    type: TransactionType;
    amount: number;
    category: Category;
    wallet: WalletType;
    date: string;
    note: string;
  }) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      ...txData,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update wallet balance automatically
    setWallets((prevWallets) =>
      prevWallets.map((w) => {
        if (w.name === txData.wallet) {
          const delta = txData.type === "income" ? txData.amount : -txData.amount;
          return { ...w, balance: Math.max(0, w.balance + delta) };
        }
        return w;
      })
    );
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Revert wallet balance
    setWallets((prevWallets) =>
      prevWallets.map((w) => {
        if (w.name === target.wallet) {
          const delta = target.type === "income" ? -target.amount : target.amount;
          return { ...w, balance: Math.max(0, w.balance + delta) };
        }
        return w;
      })
    );
  };

  const updateBudget = (category: Category, limit: number) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  };

  const transferFunds = (
    fromWallet: WalletType,
    toWallet: WalletType,
    amount: number
  ): boolean => {
    const source = wallets.find((w) => w.name === fromWallet);
    if (!source || source.balance < amount) {
      return false;
    }

    const now = new Date().toISOString();
    const outTx: Transaction = {
      id: `tx-tf-out-${Date.now()}`,
      type: "expense",
      amount,
      category: "Lainnya",
      wallet: fromWallet,
      date: now,
      note: `Transfer ke ${toWallet}`,
    };

    const inTx: Transaction = {
      id: `tx-tf-in-${Date.now() + 1}`,
      type: "income",
      amount,
      category: "Lainnya",
      wallet: toWallet,
      date: now,
      note: `Transfer dari ${fromWallet}`,
    };

    setTransactions((prev) => [outTx, inTx, ...prev]);

    setWallets((prev) =>
      prev.map((w) => {
        if (w.name === fromWallet) {
          return { ...w, balance: w.balance - amount };
        }
        if (w.name === toWallet) {
          return { ...w, balance: w.balance + amount };
        }
        return w;
      })
    );

    return true;
  };

  // Computations
  const netBalance = useMemo(() => {
    return wallets.reduce((acc, w) => acc + w.balance, 0);
  }, [wallets]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const categorySpending = useMemo(() => {
    const map = {} as Record<Category, number>;
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        isPrivate,
        togglePrivacy,
        user,
        toggleAuth,
        wallets,
        transactions,
        budgets,
        addTransaction,
        deleteTransaction,
        updateBudget,
        transferFunds,
        netBalance,
        totalIncome,
        totalExpense,
        categorySpending,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
