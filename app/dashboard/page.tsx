'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Settings, Plus } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { TransactionForm, type TransactionFormData } from "@/components/money/transaction-form"
import { formatRupiah, MONTH_LABEL } from "@/lib/money-data"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Interface Transaksi
interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  account: 'Cash' | 'Bank account'
  date: string
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#ef4444',
  Transport: '#3b82f6',
  Shopping: '#f59e0b',
  Bills: '#10b981',
  Other: '#8b5cf6',
}

export default function DashboardPage() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Load Data dari LocalStorage saat pertama kali dibuka
  useEffect(() => {
    window.scrollTo(0, 0)
    const saved = localStorage.getItem("money_guard_transactions")
    if (saved) {
      try {
        setTransactions(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse transactions", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // 2. Simpan & Tambah Transaksi Baru
  const handleAddTransaction = (data: TransactionFormData) => {
    const newTxn: Transaction = {
      id: Date.now().toString(),
      title: data.title || "Transaksi Baru",
      amount: Number(data.amount),
      type: data.type as 'income' | 'expense',
      category: data.category || "Other",
      account: (data.account as 'Cash' | 'Bank account') || "Bank account",
      date: new Date().toISOString(),
    }

    const updated = [newTxn, ...transactions]
    setTransactions(updated)
    localStorage.setItem("money_guard_transactions", JSON.stringify(updated))
    setIsTransactionFormOpen(false)
  }

  // 3. Kalkulasi Otomatis Berdasarkan Data Nyata
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalBalance = totalIncome - totalExpense

  const cashBalance = transactions
    .filter((t) => t.account === 'Cash')
    .reduce((acc, curr) => (curr.type === 'income' ? acc + curr.amount : acc - curr.amount), 0)

  const bankBalance = transactions
    .filter((t) => t.account === 'Bank account')
    .reduce((acc, curr) => (curr.type === 'income' ? acc + curr.amount : acc - curr.amount), 0)

  // BreakDown Pengeluaran per Kategori
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      return acc
    }, {} as Record<string, number>)

  const expenseBreakdown = Object.entries(expenseByCategory).map(([name, amount]) => ({
    name,
    amount,
    color: CATEGORY_COLORS[name] || '#6b7280',
  }))

  if (!isLoaded) {
    return <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-dvh p-4 text-center">Loading Data...</main>
  }

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
        <p className="text-[40px] font-bold leading-tight text-[#1a1a1a] dark:text-[#f5f5f5]">
          {formatRupiah(totalBalance)}
        </p>
        <p className="text-xs text-[#737373] dark:text-[#999999] mt-2">{MONTH_LABEL}</p>
      </section>

      {/* Accounts */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Accounts</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Cash</p>
            <p className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(cashBalance)}</p>
          </div>
          <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg p-3">
            <p className="text-xs text-[#737373] dark:text-[#999999]">Bank account</p>
            <p className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(bankBalance)}</p>
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
            <p className="text-sm font-semibold text-[#10b981]">{formatRupiah(totalIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Expenses</p>
            <p className="text-sm font-semibold text-[#ef4444]">{formatRupiah(totalExpense)}</p>
          </div>
          <div>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Total</p>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(totalBalance)}</p>
          </div>
        </div>
      </section>

      {/* Spending by Category - Pie Chart */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Spending by Category</h2>
        {expenseBreakdown.length === 0 ? (
          <p className="text-xs text-center text-[#737373] py-8">Belum ada pengeluaran</p>
        ) : (
          <>
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
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-[#737373] dark:text-[#999999]">{item.name}</span>
                  <span className="text-[#1a1a1a] dark:text-[#f5f5f5] ml-auto">{formatRupiah(item.amount)}</span>
                </div>
              ))}
            </div>
          </>
        )}
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