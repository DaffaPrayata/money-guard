'use client'

import { useState } from 'react'
import { X, Delete } from 'lucide-react'
import { expenseCategories, incomeCategories, finance, formatRupiah } from '@/lib/money-data'

export interface TransactionFormData {
  name: string
  amount: string
  type: 'income' | 'expense'
  category: string
  account: 'cash' | 'bank'
  date?: string
}

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
  initialDate?: string
}

const ACCOUNTS = [
  { id: 'cash' as const, label: 'Cash', balance: finance.accounts?.cash ?? 500_000 },
  { id: 'bank' as const, label: 'Bank account', balance: finance.accounts?.bank ?? 2_000_000 },
]

const KEYPAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', 'back']

export function TransactionForm({ isOpen, onClose, onSubmit, initialDate }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [account, setAccount] = useState<'cash' | 'bank'>('cash')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState('')

  const categories = type === 'income' ? incomeCategories : expenseCategories

  function pressKey(key: string) {
    if (key === 'back') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
      return
    }
    if (key === '.' && amount.includes('.')) return
    setAmount((prev) => {
      if (prev === '0' && key !== '.') return key
      return prev + key
    })
  }

  function handleSubmit() {
    const numericAmount = Number.parseFloat(amount)
    if (!numericAmount || numericAmount <= 0 || !category) return

    onSubmit({
      name: name.trim() || (type === 'income' ? 'Income' : 'Expense'),
      amount,
      type,
      category,
      account,
      date: initialDate,
    })

    setName('')
    setAmount('0')
    setCategory('')
    setType('expense')
    setAccount('cash')
  }

  if (!isOpen) return null

  const canSubmit = Number.parseFloat(amount) > 0 && !!category

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white dark:bg-[#1a1a1a] rounded-t-2xl border-t border-[#e5e5e5] dark:border-[#0d2b4a] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] dark:border-[#0d2b4a]">
          <button onClick={onClose} aria-label="Close" className="text-[#737373] dark:text-[#999999]">
            <X size={20} />
          </button>
          <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">New transaction</h2>
          <div className="w-5" />
        </div>

        <div className="overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* Type segmented control */}
          <div className="flex gap-2 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory('')
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-[#ef4444] text-white'
                  : 'text-[#737373] dark:text-[#999999]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory('')
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'bg-[#10b981] text-white'
                  : 'text-[#737373] dark:text-[#999999]'
              }`}
            >
              Income
            </button>
          </div>

          {/* Account selector */}
          <div className="flex gap-2 overflow-x-auto">
            {ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccount(acc.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left transition-colors ${
                  account === acc.id
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5]'
                }`}
              >
                <div className="text-xs opacity-80">{acc.label}</div>
                <div className="text-sm font-semibold">{formatRupiah(acc.balance)}</div>
              </button>
            ))}
          </div>

          {/* Amount display */}
          <div className="text-center py-4">
            <p
              className={`text-[40px] font-bold leading-tight ${
                type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}
            >
              {formatRupiah(Number.parseFloat(amount) || 0)}
            </p>
          </div>

          {/* Note */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'income' ? 'Add note (e.g. Salary)' : 'Add note (e.g. Groceries)'}
            className="w-full text-center text-sm border-b border-[#e5e5e5] dark:border-[#0d2b4a] pb-2 outline-none bg-transparent text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#999999] focus:border-[#1e3a5f]"
          />

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat.name
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5]'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: category === cat.name ? 'rgba(255,255,255,0.2)' : (cat.color ?? '#1e3a5f') }}
                >
                  {cat.icon}
                </span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2 mt-1">
            {KEYPAD_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pressKey(key)}
                className="h-12 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] text-lg font-medium flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                {key === 'back' ? <Delete size={18} /> : key}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-lg bg-[#1e3a5f] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  )
}