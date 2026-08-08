'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { expenseCategories, incomeCategories } from '@/lib/money-data'

interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  account: 'Cash' | 'Bank account'
  date: string
}

export default function NewTransactionModal({ onClose }: { onClose?: () => void }) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [selectedAccount, setSelectedAccount] = useState<'Cash' | 'Bank account'>('Cash')
  const [amountStr, setAmountStr] = useState('0')
  const [note, setNote] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // List Kategori berdasarkan tipe (Expense/Income)
  const categories = type === 'expense' ? expenseCategories : incomeCategories

  // Handler Numpad Input
  const handleNumpad = (value: string) => {
    if (value === 'backspace') {
      setAmountStr(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
      return
    }

    if (amountStr === '0') {
      if (value !== '.') setAmountStr(value)
    } else {
      if (value === '.' && amountStr.includes('.')) return
      setAmountStr(prev => prev + value)
    }
  }

  // Format Tampilan Teks Nominal saat mengetik
  const renderAmountDisplay = () => {
    if (amountStr.endsWith('.')) {
      const num = Number(amountStr.slice(0, -1)) || 0
      return `Rp ${num.toLocaleString('id-ID')}.`
    }
    const numeric = Number(amountStr) || 0
    return `Rp ${numeric.toLocaleString('id-ID')}`
  }

  // Simpan Transaksi Baru
  const handleAddTransaction = () => {
    const numericAmount = parseFloat(amountStr)
    if (!numericAmount || numericAmount <= 0) return

    const categoryObj = categories.find(c => c.name === selectedCategory) || categories[0]

    const newTxn: Transaction = {
      id: Date.now().toString(),
      title: note.trim() || categoryObj.name,
      amount: numericAmount,
      type: type,
      category: `${categoryObj.icon} ${categoryObj.name}`,
      account: selectedAccount,
      date: new Date().toISOString(),
    }

    // Ambil data transaksi lama jika ada
    let currentList: Transaction[] = []
    try {
      const saved = localStorage.getItem("money_guard_transactions") || localStorage.getItem("transactions")
      if (saved) currentList = JSON.parse(saved)
    } catch (e) {
      currentList = []
    }

    const updated = [newTxn, ...currentList]

    // Simpan ke LocalStorage
    localStorage.setItem("money_guard_transactions", JSON.stringify(updated))
    localStorage.setItem("transactions", JSON.stringify(updated))

    // Event reload/update
    window.dispatchEvent(new Event("storage"))
    window.location.reload()

    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[480px] bg-[#121212] text-white rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-4">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-300">New transaction</h2>
          <div className="w-5" />
        </div>

        {/* Expense / Income Toggle */}
        <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-gray-800">
          <button
            type="button"
            onClick={() => { setType('expense'); setSelectedCategory('') }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'expense' ? 'bg-[#990000] text-white' : 'text-gray-400'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setSelectedCategory('') }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'income' ? 'bg-[#006633] text-white' : 'text-gray-400'
            }`}
          >
            Income
          </button>
        </div>

        {/* Account Selector (Murni Teks Tanpa Angka Rp) */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedAccount('Cash')}
            className={`flex-1 py-3 px-4 rounded-xl text-center border text-sm font-semibold transition-all ${
              selectedAccount === 'Cash'
                ? 'bg-[#1e3a5f] border-blue-500 text-white'
                : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Cash
          </button>

          <button
            type="button"
            onClick={() => setSelectedAccount('Bank account')}
            className={`flex-1 py-3 px-4 rounded-xl text-center border text-sm font-semibold transition-all ${
              selectedAccount === 'Bank account'
                ? 'bg-[#1e3a5f] border-blue-500 text-white'
                : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Bank account
          </button>
        </div>

        {/* Display Nominal */}
        <div className="text-center py-2">
          <span className={`text-3xl font-extrabold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
            {renderAmountDisplay()}
          </span>
        </div>

        {/* Input Catatan */}
        <input
          type="text"
          placeholder="Add note (e.g. Groceries)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-3 py-2 text-sm text-center text-white placeholder-gray-500 outline-none focus:border-gray-600"
        />

        {/* Slider Kategori */}
        <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-[#1a1a1a] border-gray-800 text-gray-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Numpad Keyboard */}
        <div className="grid grid-cols-3 gap-2 my-1">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', 'backspace'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleNumpad(key)}
              className="bg-[#1a1a1a] hover:bg-[#252525] active:bg-[#333] border border-gray-800 rounded-xl py-3 text-base font-semibold text-white flex items-center justify-center"
            >
              {key === 'backspace' ? '⌫' : key}
            </button>
          ))}
        </div>

        {/* Tombol Simpan */}
        <button
          type="button"
          onClick={handleAddTransaction}
          disabled={amountStr === '0' || parseFloat(amountStr) <= 0}
          className="w-full bg-[#1e3a5f] hover:bg-blue-700 disabled:opacity-40 py-3 rounded-xl font-semibold text-sm transition-colors text-white"
        >
          Add Transaction
        </button>

      </div>
    </div>
  )
}