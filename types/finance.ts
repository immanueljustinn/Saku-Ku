export type WalletType = "BCA Mobile" | "SeaBank" | "DANA" | "Tunai";

export type TransactionType = "expense" | "income";

export type Category =
  | "Makanan"
  | "Transportasi"
  | "Tagihan"
  | "Hiburan"
  | "Belanja"
  | "Gaji"
  | "Uang Saku"
  | "Freelance"
  | "Investasi"
  | "Kesehatan"
  | "Lainnya";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  wallet: WalletType;
  date: string; // ISO date string or YYYY-MM-DD
  note: string;
}

export interface Wallet {
  id: string;
  name: WalletType;
  accountNumber: string;
  balance: number;
  type: "bank" | "ewallet" | "cash";
  accentColor: string;
  brandColor: string;
}

export interface BudgetLimit {
  category: Category;
  limit: number;
}

export type TimeframeOption = "today" | "daily" | "weekly" | "monthly";

export interface ChartDataPoint {
  period: string;
  income: number;
  expense: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}
