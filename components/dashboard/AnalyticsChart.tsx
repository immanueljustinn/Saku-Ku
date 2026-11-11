"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR, formatCompactIDR } from "@/lib/formatters";
import { TimeframeOption } from "@/types/finance";
import { TIMEFRAME_CHART_DATA } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";

const chartConfig = {
  income: {
    label: "Pemasukan",
    color: "#10b981", // emerald-500
  },
  expense: {
    label: "Pengeluaran",
    color: "#f43f5e", // rose-500
  },
} satisfies ChartConfig;

const TIMEFRAME_LABELS: { id: TimeframeOption; label: string }[] = [
  { id: "today", label: "Hari Ini" },
  { id: "daily", label: "Per Hari" },
  { id: "weekly", label: "Per Minggu" },
  { id: "monthly", label: "Per Bulan" },
];

export function AnalyticsChart() {
  const { isPrivate } = useFinance();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");

  const currentData = TIMEFRAME_CHART_DATA[timeframe];

  // Calculate totals for active timeframe
  const periodIncome = currentData.reduce((acc, curr) => acc + curr.income, 0);
  const periodExpense = currentData.reduce((acc, curr) => acc + curr.expense, 0);
  const netFlow = periodIncome - periodExpense;

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="size-4" />
              </div>
              <CardTitle className="font-heading text-base font-bold text-white">
                Analitik Arus Kas (Pemasukan vs Pengeluaran)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Perbandingan komparatif pemasukan dan pengeluaran secara visual.
            </CardDescription>
          </div>

          {/* Timeframe Switcher Tabs */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
            {TIMEFRAME_LABELS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeframe(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  timeframe === item.id
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mini stats bar for active timeframe */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3 text-xs">
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-400">Total Masuk</span>
            <span className="font-heading font-semibold text-emerald-400">
              {formatIDR(periodIncome, isPrivate)}
            </span>
          </div>
          <div className="flex flex-col border-x border-zinc-800/80 px-2 sm:px-4">
            <span className="text-[11px] text-zinc-400">Total Keluar</span>
            <span className="font-heading font-semibold text-rose-400">
              {formatIDR(periodExpense, isPrivate)}
            </span>
          </div>
          <div className="flex flex-col pl-2 sm:pl-4">
            <span className="text-[11px] text-zinc-400">Arus Bersih</span>
            <span
              className={`font-heading font-semibold ${
                netFlow >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatIDR(netFlow, isPrivate)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart
            data={currentData}
            margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactIDR(value)}
              tick={{ fill: "#71717a", fontSize: 10 }}
              width={55}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const numVal = typeof value === "number" ? value : Number(value);
                    const isIncome = name === "income";
                    return (
                      <div className="flex w-full items-center justify-between gap-3 text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: isIncome ? "#10b981" : "#f43f5e" }}
                          />
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>
                        <span
                          className={`font-mono font-semibold ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {formatIDR(numVal, isPrivate)}
                        </span>
                      </div>
                    );
                  }}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-md"
                />
              }
            />
            <Bar
              dataKey="income"
              name="income"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expense"
              name="expense"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-6 border-t border-zinc-800/60 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-emerald-500" />
            <span className="text-zinc-300">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-rose-500" />
            <span className="text-zinc-300">Pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
