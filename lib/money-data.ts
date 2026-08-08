export type Txn = {
  id: number | string
  icon: string
  name: string
  date: string
  amount: number
  type: "income" | "expense"
  category?: string
  account: "Cash" | "Bank account"
}

export const MONTH_LABEL = "May 2026"

// 🟢 Saldo Awal Murni Di-nol-kan (Tidak ada lagi default 500rb & 2jt)
export const INITIAL_CASH = 0
export const INITIAL_BANK = 0

export const accounts = [
  { name: "Cash", balance: INITIAL_CASH },
  { name: "Bank account", balance: INITIAL_BANK },
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

/* ----- Money Guard finance state ----- */

export type ExpenseBreakdown = { name: string; amount: number; color: string }

export const finance = {
  user: { name: "User", email: "user@email.com" },
  totalBalance: 0,
  monthlyBudget: 2_000_000,
  currentExpense: 0,
  lastMonthExpense: 0,
  income: 0,
}

export const expenseBreakdown: ExpenseBreakdown[] = []

export type CalendarTxn = { day: number; name: string; amount: number; type: "income" | "expense" }

export const calendarTransactions: CalendarTxn[] = []

export function formatRupiah(n: number) {
  return "Rp " + (n || 0).toLocaleString("id-ID")
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

/* ----- Menghitung Saldo Realtime Cash & Bank ----- */

export function getRealtimeBalances(txnList: Txn[]) {
  let cash = INITIAL_CASH
  let bank = INITIAL_BANK

  if (!Array.isArray(txnList)) return { cash, bank }

  txnList.forEach((t) => {
    const amt = Number(t.amount) || 0
    const acc = (t.account || "").toLowerCase()
    
    if (acc.includes("cash")) {
      if (t.type === "income") cash += amt
      else if (t.type === "expense") cash -= amt
    } else if (acc.includes("bank")) {
      if (t.type === "income") bank += amt
      else if (t.type === "expense") bank -= amt
    }
  })

  return { cash, bank }
}