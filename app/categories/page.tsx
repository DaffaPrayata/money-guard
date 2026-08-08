'use client'

import { useMemo, useState, useEffect } from 'react'
import { Search, X, Trash2 } from 'lucide-react'
import { BottomNav } from '@/components/money/bottom-nav'
import { formatRupiah, expenseCategories, incomeCategories } from '@/lib/money-data'

interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  account: 'Cash' | 'Bank account'
  date: string
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Gabungkan semua kategori untuk memetakan Emoji dan Nama Kategori
  const allCategories = useMemo(() => [
    ...expenseCategories.map(c => ({ name: c.name, icon: c.icon })),
    ...incomeCategories.map(c => ({ name: c.name, icon: c.icon })),
  ], [])

  // Fungsi Pembantu: Ambil Icon Emoji berdasarkan Nama Kategori
  const getCategoryIcon = (categoryName: string) => {
    const matched = allCategories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    )
    return matched?.icon || '💰' // Emoji fallback default jika tidak ketemu
  }

  // 2. Ambil data REALTIME dari LocalStorage
  useEffect(() => {
    const loadTransactions = () => {
      const saved = localStorage.getItem("money_guard_transactions")
      if (saved) {
        try {
          setTransactions(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse transactions", e)
          setTransactions([])
        }
      } else {
        setTransactions([])
      }
      setIsLoaded(true)
    }

    loadTransactions()

    window.addEventListener("storage", loadTransactions)
    return () => window.removeEventListener("storage", loadTransactions)
  }, [])

  // Fungsi Hapus Satuan Transaksi
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id)
    setTransactions(updated)
    localStorage.setItem("money_guard_transactions", JSON.stringify(updated))
  }

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType)
    }

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category.toLowerCase() === filterCategory.toLowerCase())
    }

    // Search by title
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t => t.title.toLowerCase().includes(query))
    }

    return result
  }, [transactions, searchQuery, filterType, filterCategory])

  // Group transactions by formatted date string
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}

    // Sort by date descending (terbaru di atas)
    const sorted = [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    sorted.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      if (!groups[dateStr]) {
        groups[dateStr] = []
      }
      groups[dateStr].push(t)
    })

    return Object.entries(groups).map(([dateLabel, txns]) => ({
      dateLabel,
      transactions: txns,
    }))
  }, [filteredTransactions])

  if (!isLoaded) {
    return (
      <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen p-4 text-center text-[#737373]">
        Loading History...
      </main>
    )
  }

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">History</h1>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg px-3 py-2">
          <Search size={16} className="text-[#737373] dark:text-[#999999]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#999999]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#737373] dark:text-[#999999] hover:opacity-70"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Filters */}
      <section className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="flex flex-col gap-3">
          {/* Type Filter */}
          <div>
            <label className="text-xs text-[#737373] dark:text-[#999999] font-medium block mb-1.5">Type</label>
            <div className="flex gap-2">
              {['all', 'income', 'expense'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as 'all' | 'income' | 'expense')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                    filterType === type
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#737373] dark:text-[#999999]'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs text-[#737373] dark:text-[#999999] font-medium block mb-1.5">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full py-2 px-3 border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-md text-sm bg-white dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] outline-none"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Transactions List */}
      <section className="p-4">
        {groupedByDate.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-[#737373] dark:text-[#999999] mb-2">No transactions found</p>
            <p className="text-xs text-[#737373] dark:text-[#999999]">Try adding new transactions or adjusting filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groupedByDate.map(group => (
              <div key={group.dateLabel}>
                {/* Date Header */}
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-[#737373] dark:text-[#999999] uppercase tracking-wide">
                    {group.dateLabel}
                  </h3>
                </div>

                {/* Transactions for this date */}
                <div className="flex flex-col gap-2">
                  {group.transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center gap-3 py-3 px-3 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg border border-[#e5e5e5] dark:border-[#0d2b4a]"
                    >
                      {/* Emoji Category Icon */}
                      <div className="w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center text-lg shadow-sm border border-[#e5e5e5] dark:border-[#1e3a5f]">
                        {getCategoryIcon(txn.category)}
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] truncate">
                          {txn.title}
                        </p>
                        <p className="text-xs text-[#737373] dark:text-[#999999]">
                          {txn.category} • {txn.account}
                        </p>
                      </div>

                      {/* Amount & Delete */}
                      <div className="flex items-center gap-3">
                        <div
                          className="text-sm font-semibold whitespace-nowrap"
                          style={{ color: txn.type === 'income' ? '#10b981' : '#ef4444' }}
                        >
                          {txn.type === 'income' ? '+' : '-'}{formatRupiah(txn.amount)}
                        </div>

                        <button
                          onClick={() => handleDeleteTransaction(txn.id)}
                          className="text-[#737373] hover:text-red-500 p-1 transition-colors"
                          aria-label="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav active="history" />
    </main>
  )
}