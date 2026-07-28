"use client"

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { BottomNav } from "@/components/money/bottom-nav"
import { spendingByCategory, monthlyTrend, MONTH_LABEL } from "@/lib/money-data"

export default function AnalyticsPage() {
  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Analytics</h1>
        <select
          defaultValue={MONTH_LABEL}
          className="border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-md px-2 py-1 text-sm text-[#1a1a1a] dark:text-[#f5f5f5] bg-white dark:bg-[#0d2b4a] outline-none"
        >
          <option>{MONTH_LABEL}</option>
          <option>April 2026</option>
          <option>March 2026</option>
        </select>
      </header>

      {/* Spending by Category */}
      <section className="p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Spending by Category</h2>
        <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  isAnimationActive={false}
                >
                  {spendingByCategory.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {spendingByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">{c.name}</span>
                </div>
                <span className="text-[#737373] dark:text-[#999999]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Trend */}
      <section className="px-4 pb-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Monthly Trend</h2>
        <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-4">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#737373" }} axisLine={false} tickLine={false} width={28} />
                <Bar dataKey="income" fill="#10b981" isAnimationActive={false} />
                <Bar dataKey="expense" fill="#ef4444" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#10b981]" />
              <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#ef4444]" />
              <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">Expense</span>
            </div>
          </div>
        </div>
      </section>

      <BottomNav active="home" />
    </main>
  )
}
