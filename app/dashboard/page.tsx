'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Settings, Plus } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { TransactionForm, type TransactionFormData } from "@/components/money/transaction-form"
import {
  finance,
  formatRupiah,
  expenseBreakdown,
  MONTH_LABEL,
} from "@/lib/money-data"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleAddTransaction = (data: TransactionFormData) => {
    console.log("[v0] New transaction:", data)
    setIsTransactionFormOpen(false)
  }

  const monthlyData = [
    { month: "Jan", income: 4_500_000, expense: 1_200_000 },
    { month: "Feb", income: 5_200_000, expense: 1_400_000 },
    { month: "Mar", income: 4_800_000, expense: 1_300_000 },
    { month: "Apr", income: 5_000_000, expense: 1_500_000 },
    { month: "May", income: 5_000_000, expense: finance.currentExpense },
  ]

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-dvh pb-32 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Home</h1>
        <Link href="/profile" aria-label="Settings">
          <Settings size={20} className="text-[#1a1a1a] dark:text-[#f5f5f5]" />
        </Link>
      </header>

      {/* Total balance */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <p className="text-xs text-[#737373] dark:text-[#999999]">Total balance</p>
        <p className="text-[40px] font-bold leading-tight text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(finance.totalBalance)}</p>
        <p className="text-xs text-[#737373] dark:text-[#999999] mt-2">{MONTH_LABEL}</p>
      </section>

      {/* Accounts */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Accounts</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Cash</p>
            <p className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Rp 500.000</p>
          </div>
          <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Bank account</p>
            <p className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Rp 2.000.000</p>
          </div>
        </div>
      </section>

      {/* Cash flow */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5]">Cash flow</h2>
          <span className="text-xs text-[#737373] dark:text-[#999999]">{MONTH_LABEL}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Income</p>
            <p className="text-sm font-semibold text-[#10b981]">{formatRupiah(finance.income)}</p>
          </div>
          <div>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Expenses</p>
            <p className="text-sm font-semibold text-[#ef4444]">{formatRupiah(finance.currentExpense)}</p>
          </div>
          <div>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Total</p>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(finance.income - finance.currentExpense)}</p>
          </div>
        </div>
      </section>

      {/* Spending by Category - Pie Chart */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Spending by Category</h2>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1 text-xs">
          {expenseBreakdown.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#737373] dark:text-[#999999]">{item.name}</span>
              <span className="text-[#1a1a1a] dark:text-[#f5f5f5] ml-auto">{formatRupiah(item.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Trend - Bar Chart */}
      <section className="p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Monthly trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
            <XAxis dataKey="month" stroke="#737373" style={{ fontSize: '12px' }} />
            <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
              }}
              formatter={(value) => formatRupiah(value as number)}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <TransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Floating Add Transaction Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsTransactionFormOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-[#1e3a5f] text-white rounded-full shadow-lg shadow-black/20 hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          aria-label="Add transaction"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      <BottomNav active="home" />
    </main>
  )
}