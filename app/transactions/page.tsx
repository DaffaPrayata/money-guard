"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { transactions, formatMoney, MONTH_LABEL } from "@/lib/money-data"

export default function TransactionsPage() {
  const [query, setQuery] = useState("")

  const filtered = transactions.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()),
  )

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const total = income - expense

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg px-3 py-2">
          <Search size={16} className="text-[#737373] dark:text-[#999999]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-full text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#999999]"
          />
        </div>
        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mt-3">{MONTH_LABEL}</p>
      </header>

      {/* Summary */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Income</p>
            <p className="text-sm font-semibold text-[#10b981]">{formatMoney(income)}</p>
          </div>
          <div className="text-center bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Expense</p>
            <p className="text-sm font-semibold text-[#ef4444]">{formatMoney(expense)}</p>
          </div>
          <div className="text-center bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Total</p>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{formatMoney(total)}</p>
          </div>
        </div>
      </section>

      {/* Transactions list */}
      <section className="p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Recent Transactions</h2>
        {filtered.length === 0 ? (
          <p className="text-center text-[#737373] dark:text-[#999999] text-sm py-10">No transactions found</p>
        ) : (
          <div>
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center py-3 border-b border-[#f0f0f0] dark:border-[#0d2b4a]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <p className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{t.name}</p>
                    <p className="text-xs text-[#737373] dark:text-[#999999]">{t.date}</p>
                  </div>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.type === "income" ? "#10b981" : "#ef4444" }}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatMoney(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav active="home" />
    </main>
  )
}
