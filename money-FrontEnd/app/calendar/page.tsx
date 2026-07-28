"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { Modal } from "@/components/money/modal"
import { TransactionForm, type TransactionFormData } from "@/components/money/transaction-form"
import { calendarTransactions, type CalendarTxn, formatRupiah } from "@/lib/money-data"

// Fixed to May 2026
const YEAR = 2026
const MONTH = 4 // May (0-indexed)
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export default function CalendarPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)

  const handleAddTransaction = (data: TransactionFormData) => {
    console.log("[v0] New transaction for", selected, ":", data)
    setIsTransactionFormOpen(false)
  }

  // Group transactions by day
  const byDay = useMemo(() => {
    const map = new Map<number, CalendarTxn[]>()
    for (const t of calendarTransactions) {
      const arr = map.get(t.day) ?? []
      arr.push(t)
      map.set(t.day, arr)
    }
    return map
  }, [])

  const firstWeekday = new Date(YEAR, MONTH, 1).getDay()
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function dayNet(day: number) {
    const txns = byDay.get(day) ?? []
    return txns.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0)
  }



  const selectedTxns = selected ? byDay.get(selected) ?? [] : []

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Calendar</h1>
        <p className="text-xs text-[#737373] dark:text-[#999999] mt-0.5">May 2026</p>
      </header>

      <section className="p-4">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs text-[#737373] dark:text-[#999999] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} />
            const txns = byDay.get(day)
            const net = txns ? dayNet(day) : 0
            const hasTxn = !!txns
            return (
              <button
                key={day}
                onClick={() => hasTxn && setSelected(day)}
                className="aspect-square border border-[#f0f0f0] dark:border-[#0d2b4a] rounded-md flex flex-col items-center justify-center gap-1 hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors"
              >
                <span className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{day}</span>
                {hasTxn && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: net >= 0 ? "#10b981" : "#ef4444" }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-[#737373] dark:text-[#999999]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Net income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Net expense
          </span>
        </div>
      </section>

      <Modal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `May ${selected}, 2026` : ""}
      >
        <div className="flex flex-col gap-3">
          {/* Add Transaction Button at Top */}
          <button
            onClick={() => setIsTransactionFormOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1e3a5f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity mb-2"
          >
            <Plus size={18} />
            Add transaction
          </button>

          {selectedTxns.length > 0 && (
            <>
              {selectedTxns.map((t, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{t.name}</span>
                  <span className="text-sm" style={{ color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                    {t.type === "income" ? "+" : "-"}
                    {formatRupiah(t.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t border-[#e5e5e5] dark:border-[#0d2b4a] pt-3 text-sm font-medium">
                <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">Net</span>
                <span style={{ color: selected && dayNet(selected) >= 0 ? "#10b981" : "#ef4444" }}>
                  {formatRupiah(selected ? dayNet(selected) : 0)}
                </span>
              </div>
            </>
          )}
        </div>
      </Modal>

      <TransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSubmit={handleAddTransaction}
        initialDate={selected ? `May ${selected}, 2026` : undefined}
      />

      <BottomNav active="history" />
    </main>
  )
}
