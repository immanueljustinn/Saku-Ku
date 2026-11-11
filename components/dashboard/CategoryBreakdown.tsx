"use client";

import React, { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatIDR, formatCompactIDR } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Makanan: "#f59e0b", // amber-500
  Transportasi: "#3b82f6", // blue-500
  Tagihan: "#6366f1", // indigo-500
  Hiburan: "#a855f7", // purple-500
  Belanja: "#ec4899", // pink-500
  Kesehatan: "#f43f5e", // rose-500
  Lainnya: "#71717a", // zinc-500
};

export function CategoryBreakdown() {
  const { categorySpending, totalExpense, isPrivate } = useFinance();

  const chartData = useMemo(() => {
    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        color: CATEGORY_COLORS[category] || "#10b981",
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [categorySpending, totalExpense]);

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <PieChartIcon className="size-4" />
            </div>
            <div>
              <CardTitle className="font-heading text-base font-bold text-white">
                Distribusi Pengeluaran
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Porsi pengeluaran berdasarkan kategori bulan ini
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {chartData.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            Belum ada data pengeluaran
          </div>
        ) : (
          <div className="space-y-4">
            {/* Donut Chart */}
            <div className="relative h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-md">
                          <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.name}:{" "}
                            <strong className="text-white font-mono">
                              {formatIDR(data.value, isPrivate)}
                            </strong>
                            <span className="text-zinc-400">({data.percentage}%)</span>
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={chartData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Total
                </span>
                <span className="font-heading text-xs font-bold text-white">
                  {formatCompactIDR(totalExpense, isPrivate)}
                </span>
              </div>
            </div>

            {/* Itemized Legend with Percentages */}
            <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/80 pt-3">
              {chartData.slice(0, 6).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-zinc-950/40 px-2.5 py-1.5 text-[11px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono font-medium text-zinc-400">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
