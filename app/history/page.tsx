'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { BottomNav } from '@/components/money/bottom-nav'
import { calendarTransactions, formatRupiah, expenseCategories, incomeCategories } from '@/lib/money-data'
import type { CalendarTxn } from '@/lib/money-data'

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Get all categories for filter dropdown
  const allCategories = [
    ...expenseCategories.map(c => ({ name: c.name, icon: c.icon })),
    ...incomeCategories.map(c => ({ name: c.name, icon: c.icon })),
  ]

  // Map transaction names to their categories
  const getTransactionCategory = (name: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories
    // For now, match by generic category. In a real app, transactions would have a category field
    // This is a simplified mapping - in production, use actual category IDs
    const categoryMap: Record<string, string> = {
      'Salary': 'Gaji',
      'Refund': 'Gaji',
      'Groceries': 'Food & Drinks',
      'Lunch': 'Food & Drinks',
      'Coffee': 'Food & Drinks',
      'Bus fare': 'Transport',
      'Taxi': 'Transport',
      'New shoes': 'Shopping',
      'Dinner out': 'Food & Drinks',
    }
    return categoryMap[name] || null
  }

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let result = [...calendarTransactions]

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType)
    }

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(t => {
        const category = getTransactionCategory(t.name, t.type)
        return category === filterCategory
      })
    }

    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(query))
    }

    return result
  }, [searchQuery, filterType, filterCategory])

  // Group transactions by date (descending)
  const groupedByDate = useMemo(() => {
    const groups: Record<number, CalendarTxn[]> = {}
    
    // Sort by day descending
    const sorted = [...filteredTransactions].sort((a, b) => b.day - a.day)
    
    sorted.forEach(t => {
      if (!groups[t.day]) {
        groups[t.day] = []
      }
      groups[t.day].push(t)
    })

    return Object.entries(groups)
      .sort(([dayA], [dayB]) => Number(dayB) - Number(dayA))
      .map(([day, txns]) => ({ day: Number(day), transactions: txns }))
  }, [filteredTransactions])

  // Get category icon by transaction name
  const getCategoryIcon = (txnName: string, type: 'income' | 'expense') => {
    const categoryName = getTransactionCategory(txnName, type)
    const category = allCategories.find(c => c.name === categoryName)
    return category?.icon || '💰'
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
            <p className="text-xs text-[#737373] dark:text-[#999999]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groupedByDate.map(group => (
              <div key={group.day}>
                {/* Date Header */}
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-[#737373] dark:text-[#999999] uppercase tracking-wide">
                    May {group.day}, 2026
                  </h3>
                </div>

                {/* Transactions for this date */}
                <div className="flex flex-col gap-2">
                  {group.transactions.map((txn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-3 px-3 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-lg border border-[#e5e5e5] dark:border-[#0d2b4a]"
                    >
                      {/* Category Icon */}
                      <div className="text-lg">{getCategoryIcon(txn.name, txn.type)}</div>

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] truncate">
                          {txn.name}
                        </p>
                        <p className="text-xs text-[#737373] dark:text-[#999999]">
                          May {txn.day}
                        </p>
                      </div>

                      {/* Amount */}
                      <div
                        className="text-sm font-semibold whitespace-nowrap"
                        style={{ color: txn.type === 'income' ? '#10b981' : '#ef4444' }}
                      >
                        {txn.type === 'income' ? '+' : '-'}{formatRupiah(txn.amount)}
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
