import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { X, Delete } from 'lucide-react-native'
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

  const canSubmit = Number.parseFloat(amount) > 0 && !!category

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <X size={20} color="#737373" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New transaction</Text>
            <View style={{ width: 20 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Type segmented control */}
            <View style={styles.typeContainer}>
              <TouchableOpacity
                onPress={() => {
                  setType('expense')
                  setCategory('')
                }}
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.expenseActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === 'expense' && styles.activeTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setType('income')
                  setCategory('')
                }}
                style={[
                  styles.typeButton,
                  type === 'income' && styles.incomeActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === 'income' && styles.activeTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Account selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
              <View style={styles.rowGap}>
                {ACCOUNTS.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setAccount(acc.id)}
                    style={[
                      styles.accountCard,
                      account === acc.id ? styles.accountActive : styles.accountInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.accountLabel,
                        { color: account === acc.id ? '#ffffff' : '#737373' },
                      ]}
                    >
                      {acc.label}
                    </Text>
                    <Text
                      style={[
                        styles.accountBalance,
                        { color: account === acc.id ? '#ffffff' : '#1a1a1a' },
                      ]}
                    >
                      {formatRupiah(acc.balance)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Amount display */}
            <View style={styles.amountContainer}>
              <Text
                style={[
                  styles.amountText,
                  { color: type === 'income' ? '#10b981' : '#ef4444' },
                ]}
              >
                {formatRupiah(Number.parseFloat(amount) || 0)}
              </Text>
            </View>

            {/* Note */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={type === 'income' ? 'Add note (e.g. Salary)' : 'Add note (e.g. Groceries)'}
              placeholderTextColor="#737373"
              style={styles.inputNote}
            />

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.rowGap}>
                {categories.map((cat) => {
                  const isSelected = category === cat.name
                  return (
                    <TouchableOpacity
                      key={cat.name}
                      onPress={() => setCategory(cat.name)}
                      style={[
                        styles.categoryChip,
                        isSelected ? styles.categoryActive : styles.categoryInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIconCircle,
                          {
                            backgroundColor: isSelected
                              ? 'rgba(255,255,255,0.2)'
                              : (cat.color ?? '#1e3a5f'),
                          },
                        ]}
                      >
                        <Text style={styles.categoryIconText}>{cat.icon}</Text>
                      </View>
                      <Text
                        style={[
                          styles.categoryName,
                          { color: isSelected ? '#ffffff' : '#1a1a1a' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>

            {/* Numeric keypad */}
            <View style={styles.keypadGrid}>
              {KEYPAD_KEYS.map((key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => pressKey(key)}
                  style={styles.keypadButton}
                >
                  {key === 'back' ? (
                    <Delete size={18} color="#1a1a1a" />
                  ) : (
                    <Text style={styles.keypadText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>Add Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '92%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 9999,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
  },
  expenseActive: {
    backgroundColor: '#ef4444',
  },
  incomeActive: {
    backgroundColor: '#10b981',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#737373',
  },
  activeTypeText: {
    color: '#ffffff',
  },
  accountScroll: {
    flexDirection: 'row',
  },
  rowGap: {
    flexDirection: 'row',
    gap: 8,
  },
  accountCard: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
  },
  accountActive: {
    backgroundColor: '#1e3a5f',
  },
  accountInactive: {
    backgroundColor: '#f5f5f5',
  },
  accountLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  amountText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  inputNote: {
    textAlign: 'center',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 8,
    color: '#1a1a1a',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 9999,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
  },
  categoryActive: {
    backgroundColor: '#1e3a5f',
  },
  categoryInactive: {
    backgroundColor: '#f5f5f5',
  },
  categoryIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  keypadButton: {
    width: '31%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
})