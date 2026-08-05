export type Txn = {
  id: number
  icon: string
  name: string
  date: string
  amount: number
  type: "income" | "expense"
}

export const MONTH_LABEL = "May 2026"

export const accounts = [
  { name: "Cash", balance: 0 },
  { name: "Bank account", balance: 0 },
]

export const cashFlow = { income: 0, expenses: 0, total: 0 }

export const expenseCategories = [
  { icon: "🍔", name: "Food & Drinks", amount: 0 },
  { icon: "🛍️", name: "Shopping", amount: 0 },
  { icon: "🏠", name: "Housing", amount: 0 },
  { icon: "📱", name: "Bills", amount: 0 },
  { icon: "🚗", name: "Transport", amount: 0 },
  { icon: "🏥", name: "Healthcare", amount: 0 },
]

export const incomeCategories = [
  { icon: "💼", name: "Gaji", amount: 0 },
  { icon: "💻", name: "Freelance", amount: 0 },
]

export const transactions: Txn[] = []

export const spendingByCategory = [
  { name: "Food & Drinks", value: 40, color: "#1e3a5f" },
  { name: "Shopping", value: 25, color: "#10b981" },
  { name: "Housing", value: 20, color: "#737373" },
  { name: "Bills", value: 15, color: "#d4d4d4" },
]

export const monthlyTrend = [
  { month: "Jan", income: 0, expense: 0 },
  { month: "Feb", income: 0, expense: 0 },
  { month: "Mar", income: 0, expense: 0 },
  { month: "Apr", income: 0, expense: 0 },
  { month: "May", income: 0, expense: 0 },
  { month: "Jun", income: 0, expense: 0 },
]

export function formatMoney(n: number) {
  return `$${n.toFixed(2)}`
}

/* ----- Money Guard finance state (Rupiah, used by new features) ----- */

export type ExpenseBreakdown = { name: string; amount: number; color: string }

export const finance = {
  user: { name: "Budi Santoso", email: "budi@email.com" },
  totalBalance: 2_500_000,
  monthlyBudget: 2_000_000,
  currentExpense: 1_250_000,
  lastMonthExpense: 1_500_000,
  income: 5_000_000,
}

export const expenseBreakdown: ExpenseBreakdown[] = [
  { name: "Food & Drinks", amount: 750_000, color: "#1e3a5f" },
  { name: "Shopping", amount: 300_000, color: "#10b981" },
  { name: "Transport", amount: 200_000, color: "#737373" },
]

export type CalendarTxn = { day: number; name: string; amount: number; type: "income" | "expense" }

// Transactions across the current month (May 2026) keyed by day
export const calendarTransactions: CalendarTxn[] = [
  { day: 1, name: "Salary", amount: 5_000_000, type: "income" },
  { day: 3, name: "Groceries", amount: 120_000, type: "expense" },
  { day: 8, name: "Bus fare", amount: 20_000, type: "expense" },
  { day: 12, name: "Lunch", amount: 65_000, type: "expense" },
  { day: 15, name: "Refund", amount: 50_000, type: "income" },
  { day: 16, name: "New shoes", amount: 350_000, type: "expense" },
  { day: 16, name: "Coffee", amount: 35_000, type: "expense" },
  { day: 22, name: "Dinner out", amount: 180_000, type: "expense" },
  { day: 27, name: "Taxi", amount: 80_000, type: "expense" },
]

export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID")
}

export const currencies = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
]

export function formatCurrency(amount: number, currencyCode: string = 'IDR') {
  const currency = currencies.find(c => c.code === currencyCode)
  if (!currency) return formatRupiah(amount)
  
  if (currencyCode === 'IDR') return formatRupiah(amount)
  
  return currency.symbol + (amount / 1000).toFixed(2)
}
