'use client'

import { useEffect, useState } from 'react'
import { X, Delete, Check } from 'lucide-react'
import { expenseCategories, incomeCategories, formatRupiah } from '@/lib/money-data'

export interface TransactionFormData {
  title: string
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
  { id: 'cash' as const, label: 'Cash', icon: '💵', desc: 'Wallet / cash on hand' },
  { id: 'bank' as const, label: 'Bank account', icon: '🏦', desc: 'Bank transfer' },
]

const KEYPAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', 'back']

export function TransactionForm({ isOpen, onClose, onSubmit, initialDate }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [account, setAccount] = useState<'cash' | 'bank'>('cash')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState('')
  const [visible, setVisible] = useState(false)

  const categories = type === 'income' ? incomeCategories : expenseCategories

  // Small mount delay so the sheet can transition in instead of popping in instantly
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
  }, [isOpen])

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
      title: name.trim() || (type === 'income' ? 'Income' : 'Expense'),
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
  const accent = type === 'income' ? '#10b981' : '#ef4444'

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center transition-opacity duration-200 ${
        visible ? 'bg-black/50' : 'bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[480px] max-h-[92vh] bg-white dark:bg-[#1a1a1a] rounded-t-2xl border-t border-[#e5e5e5] dark:border-[#0d2b4a] flex flex-col overflow-hidden shadow-2xl transition-transform duration-200 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#e5e5e5] dark:bg-[#2a2a2a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e5e5e5] dark:border-[#0d2b4a]">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#737373] dark:text-[#999999] hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">New transaction</h2>
          <div className="w-8" />
        </div>

        <div className="overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* Type segmented control (Expense / Income) */}
          <div className="flex gap-2 bg-[#f5f5f5] dark:bg-[#0d2b4a] rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory('')
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-[#ef4444] text-white shadow-sm'
                  : 'text-[#737373] dark:text-[#999999] hover:text-[#1a1a1a] dark:hover:text-[#f5f5f5]'
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
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : 'text-[#737373] dark:text-[#999999] hover:text-[#1a1a1a] dark:hover:text-[#f5f5f5]'
              }`}
            >
              Income
            </button>
          </div>

          {/* Account selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#737373] dark:text-[#999999] px-1">Account</span>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNTS.map((acc) => {
                const isSelected = account === acc.id
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAccount(acc.id)}
                    className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white'
                        : 'bg-[#f5f5f5] dark:bg-[#0d2b4a]/50 border-transparent text-[#1a1a1a] dark:text-[#f5f5f5] hover:border-[#e5e5e5] dark:hover:border-[#1e3a5f]'
                    }`}
                  >
                    <span
                      className={`text-xl w-8 h-8 shrink-0 flex items-center justify-center rounded-lg ${
                        isSelected ? 'bg-white/15' : 'bg-white dark:bg-[#1a1a1a]'
                      }`}
                    >
                      {acc.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-[#1a1a1a] dark:text-[#f5f5f5]'}`}>
                        {acc.label}
                      </span>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-white/70' : 'text-[#737373] dark:text-[#999999]'}`}>
                        {acc.desc}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 text-white">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount display */}
          <div className="text-center py-1">
            <p
              className="text-[40px] font-bold leading-tight tabular-nums transition-colors"
              style={{ color: accent }}
            >
              {formatRupiah(Number.parseFloat(amount) || 0)}
            </p>
          </div>

          {/* Note */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'income' ? 'Add note (e.g. Salary)' : 'Add note (e.g. Groceries)'}
            className="w-full text-center text-sm border-b border-[#e5e5e5] dark:border-[#0d2b4a] pb-2 outline-none bg-transparent text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#999999] focus:border-[#1e3a5f] transition-colors"
          />

          {/* Category chips */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#737373] dark:text-[#999999] px-1">Category</span>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                    category === cat.name
                      ? 'bg-[#1e3a5f] text-white shadow-sm'
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
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2 mt-1">
            {KEYPAD_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pressKey(key)}
                aria-label={key === 'back' ? 'Delete last digit' : key}
                className="h-12 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] text-lg font-medium flex items-center justify-center active:scale-95 active:bg-[#e5e5e5] dark:active:bg-[#12345a] transition-all"
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
            className="w-full py-3.5 rounded-lg bg-[#1e3a5f] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#254a75] active:scale-[0.99] transition-all shadow-sm"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          >
            {canSubmit ? `Add ${type === 'income' ? 'Income' : 'Expense'}` : 'Select a category to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}