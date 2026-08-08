'use client'

import { useState, useEffect } from "react"
import { User, Download, RotateCcw, Moon, Sun } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { Button } from "@/components/money/button"
import { Modal } from "@/components/money/modal"
import { finance, calendarTransactions, formatRupiah, currencies } from "@/lib/money-data"

export default function ProfilePage() {
  const [dark, setDark] = useState(false)
  const [currency, setCurrency] = useState('IDR')
  const [resetOpen, setResetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const txnCount = calendarTransactions.length

  useEffect(() => {
    setMounted(true)
    const isDark = localStorage.getItem('money-guard-dark') === 'true'
    setDark(isDark)
    const savedCurrency = localStorage.getItem('money-guard-currency') || 'IDR'
    setCurrency(savedCurrency)
  }, [])

  function toggleDark() {
    const newDark = !dark
    setDark(newDark)
    localStorage.setItem('money-guard-dark', String(newDark))
    if (newDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function handleCurrencyChange(code: string) {
    setCurrency(code)
    localStorage.setItem('money-guard-currency', code)
  }

  function exportCsv() {
    const header = "day,name,amount,type"
    const rows = calendarTransactions.map((t) => `2026-05-${String(t.day).padStart(2, "0")},${t.name},${t.amount},${t.type}`)
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "money-guard-transactions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!mounted) return null

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Profile</h1>
      </header>

      {/* User card (Tanpa Email) */}
      <section className="p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-4 border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg p-4 bg-white dark:bg-[#1a1a1a]">
          <div className="w-14 h-14 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0">
            <User size={26} />
          </div>
          <div>
            <div className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{finance.user.name}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg p-4 bg-white dark:bg-[#1a1a1a]">
            <div className="text-xs text-[#737373] dark:text-[#999999]">Transactions</div>
            <div className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] mt-1">{txnCount}</div>
          </div>
          <div className="border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg p-4 bg-white dark:bg-[#1a1a1a]">
            <div className="text-xs text-[#737373] dark:text-[#999999]">Balance</div>
            <div className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] mt-1">{formatRupiah(finance.totalBalance)}</div>
          </div>
        </div>
      </section>

      {/* Settings list (Tanpa Logout) */}
      <section className="px-4 bg-white dark:bg-[#1a1a1a]">
        <div className="border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg divide-y divide-[#f0f0f0] dark:divide-[#0d2b4a] bg-white dark:bg-[#1a1a1a]">
          {/* Currency selector */}
          <div className="p-4">
            <div className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Currency</div>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f5f5f5] dark:bg-[#0d2b4a] bg-white"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={exportCsv} className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors">
            <Download size={18} className="text-[#1e3a5f]" />
            <span className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">Export data (CSV)</span>
          </button>

          <div className="flex items-center justify-between p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors">
            <span className="flex items-center gap-3">
              {dark ? (
                <Moon size={18} className="text-[#1e3a5f]" />
              ) : (
                <Sun size={18} className="text-[#1e3a5f]" />
              )}
              <span className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">Dark mode</span>
            </span>
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="w-11 h-6 rounded-full border border-[#e5e5e5] dark:border-[#0d2b4a] relative transition-colors"
              style={{ backgroundColor: dark ? "#1e3a5f" : "#f0f0f0" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: dark ? "22px" : "2px" }}
              />
            </button>
          </div>

          <button
            onClick={() => setResetOpen(true)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors"
          >
            <RotateCcw size={18} className="text-[#ef4444]" />
            <span className="text-sm text-[#ef4444]">Reset data</span>
          </button>
        </div>
      </section>

      <Modal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset data"
      >
        <p className="text-sm text-[#737373] dark:text-[#999999]">
          This will clear all your transactions and reset Money Guard to its starting state. This cannot be undone.
        </p>
        <div className="mt-3">
          <Button variant="danger" onClick={() => setResetOpen(false)} className="w-full">
            Yes, reset everything
          </Button>
        </div>
      </Modal>

      <BottomNav active="more" />
    </main>
  )
}