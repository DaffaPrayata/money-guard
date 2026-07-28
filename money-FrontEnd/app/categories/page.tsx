'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { BottomNav } from '@/components/money/bottom-nav'
import { Modal } from '@/components/money/modal'
import { Input } from '@/components/money/input'
import { Button } from '@/components/money/button'
import { formatRupiah } from '@/lib/money-data'

interface Category {
  id: string
  icon: string
  name: string
  type: 'income' | 'expense'
  color: string
  monthlyBudget: number
  spent: number
}

const EMOJI_ICONS = ['🍔', '🛍️', '🏠', '📱', '🚗', '🏥', '💼', '💻', '📚', '🎮', '✈️', '🎬', '🎵', '⚽', '🌳']
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e']

// Mock category data with budgets
const mockCategories: Category[] = [
  { id: '1', icon: '💼', name: 'Gaji', type: 'income', color: '#10b981', monthlyBudget: 5_000_000, spent: 0 },
  { id: '2', icon: '💻', name: 'Freelance', type: 'income', color: '#06b6d4', monthlyBudget: 2_000_000, spent: 0 },
  { id: '3', icon: '🍔', name: 'Food & Drinks', type: 'expense', color: '#f59e0b', monthlyBudget: 1_500_000, spent: 600_000 },
  { id: '4', icon: '🛍️', name: 'Shopping', type: 'expense', color: '#ec4899', monthlyBudget: 800_000, spent: 420_000 },
  { id: '5', icon: '🏠', name: 'Housing', type: 'expense', color: '#8b5cf6', monthlyBudget: 3_000_000, spent: 2_400_000 },
  { id: '6', icon: '📱', name: 'Bills', type: 'expense', color: '#06b6d4', monthlyBudget: 500_000, spent: 450_000 },
  { id: '7', icon: '🚗', name: 'Transport', type: 'expense', color: '#ef4444', monthlyBudget: 1_000_000, spent: 950_000 },
  { id: '8', icon: '🏥', name: 'Healthcare', type: 'expense', color: '#10b981', monthlyBudget: 600_000, spent: 0 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: '💼',
    color: '#ef4444',
    monthlyBudget: 0,
  })

  // Group categories by type
  const groupedCategories = useMemo(() => {
    return {
      income: categories.filter(c => c.type === 'income'),
      expense: categories.filter(c => c.type === 'expense'),
    }
  }, [categories])

  // Get budget progress color
  const getBudgetColor = (spent: number, budget: number): string => {
    if (budget === 0) return '#e5e5e5'
    const percentage = (spent / budget) * 100
    if (percentage >= 80) return '#ef4444' // Red
    if (percentage >= 50) return '#f59e0b' // Amber
    return '#10b981' // Green
  }

  const handleAddCategory = () => {
    if (!formData.name.trim()) return

    if (editingId) {
      setCategories(categories.map(c =>
        c.id === editingId
          ? { ...c, ...formData }
          : c
      ))
      setEditingId(null)
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        spent: 0,
      }
      setCategories([...categories, newCategory])
    }

    setFormData({ name: '', type: 'expense', icon: '💼', color: '#ef4444', monthlyBudget: 0 })
    setIsAddModalOpen(false)
  }

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      monthlyBudget: category.monthlyBudget,
    })
    setEditingId(category.id)
    setIsAddModalOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id))
    setShowDeleteConfirm(null)
  }

  const CategoryRow = ({ category }: { category: Category }) => {
    const percentage = category.monthlyBudget > 0 ? (category.spent / category.monthlyBudget) * 100 : 0
    const budgetColor = getBudgetColor(category.spent, category.monthlyBudget)

    return (
      <div
        key={category.id}
        className="flex items-center gap-3 p-4 border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors cursor-pointer"
        onClick={() => handleEditCategory(category)}
      >
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-2xl">{category.icon}</div>
            <div className="font-medium text-[#1a1a1a] dark:text-[#f5f5f5]">{category.name}</div>
          </div>
          <div className="text-xs text-[#737373] dark:text-[#999999] mb-2">
            {formatRupiah(category.spent)} / {formatRupiah(category.monthlyBudget)}
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 bg-[#e5e5e5] dark:bg-[#0d2b4a] rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: budgetColor,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEditCategory(category)
            }}
            className="p-2 text-[#1e3a5f] hover:bg-[#e5e5e5] dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteConfirm(category.id)
            }}
            className="p-2 text-[#ef4444] hover:bg-[#e5e5e5] dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm === category.id && (
          <Modal
            isOpen={true}
            onClose={() => setShowDeleteConfirm(null)}
            title="Delete Category"
          >
            <p className="text-sm text-[#737373] dark:text-[#999999] mb-4">
              Are you sure you want to delete "{category.name}"? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteCategory(category.id)}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </Modal>
        )}
      </div>
    )
  }

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Categories</h1>
          <button
            onClick={() => {
              setFormData({ name: '', type: 'expense', icon: '💼', color: '#ef4444', monthlyBudget: 0 })
              setEditingId(null)
              setIsAddModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Income Categories */}
        {groupedCategories.income.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Income</h2>
            <div className="space-y-2">
              {groupedCategories.income.map(cat => (
                <CategoryRow key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        )}

        {/* Expense Categories */}
        {groupedCategories.expense.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5] mb-3">Expenses</h2>
            <div className="space-y-2">
              {groupedCategories.expense.map(cat => (
                <CategoryRow key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-[#737373] dark:text-[#999999]">No categories yet</p>
            <p className="text-sm text-[#737373] dark:text-[#999999] mt-1">Add your first category to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingId(null)
          setFormData({ name: '', type: 'expense', icon: '💼', color: '#ef4444', monthlyBudget: 0 })
        }}
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4">
          {/* Name */}
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Groceries"
          />

          {/* Type */}
          <div>
            <label className="text-xs text-[#525252] dark:text-[#999999] block mb-1.5">Type</label>
            <div className="flex gap-2">
              {(['income', 'expense'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === type
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-xs text-[#525252] dark:text-[#999999] block mb-1.5">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_ICONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`text-2xl py-2 rounded-lg transition-colors ${
                    formData.icon === emoji
                      ? 'bg-[#1e3a5f] dark:bg-[#1e3a5f]'
                      : 'hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs text-[#525252] dark:text-[#999999] block mb-1.5">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-full h-10 rounded-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: color,
                    border: formData.color === color ? '3px solid #1a1a1a' : '2px solid #e5e5e5',
                  }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Monthly Budget */}
          <Input
            label="Monthly Budget"
            type="number"
            value={formData.monthlyBudget}
            onChange={(e) => setFormData({ ...formData, monthlyBudget: Number(e.target.value) })}
            placeholder="0"
          />

          {/* Submit Button */}
          <Button
            type="button"
            variant="primary"
            onClick={handleAddCategory}
            className="w-full"
          >
            {editingId ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </Modal>

      <BottomNav active="more" />
    </main>
  )
}
