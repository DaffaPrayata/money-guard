import { formatRupiah } from "./money-data"

interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  account: 'Cash' | 'Bank account'
  date: string
}

export const guardSuggestions = [
  "Berapa sisa saldoku?",
  "Berapa pengeluaranku?",
  "Pengeluaran terbesar untuk apa?",
  "Berapa pemasukanku?",
]

export function getGuardReply(userQuery: string, transactions: Transaction[] = []): string {
  const query = userQuery.toLowerCase()

  // Hitung data aktual
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const balance = income - expense

  // Hitung pengeluaran per kategori
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      return acc
    }, {} as Record<string, number>)

  let topCategory = "Belum ada pengeluaran"
  let topCategoryAmount = 0

  Object.entries(expenseByCategory).forEach(([cat, amount]) => {
    if (amount > topCategoryAmount) {
      topCategoryAmount = amount
      topCategory = cat
    }
  })

  // Logika Jawaban
  if (query.includes("saldo") || query.includes("balance") || query.includes("uang")) {
    return `Total saldomu saat ini adalah ${formatRupiah(balance)}.`
  }

  if (query.includes("pengeluaran") || query.includes("expense") || query.includes("boros")) {
    return `Total pengeluaranmu sejauh ini adalah ${formatRupiah(expense)}.`
  }

  if (query.includes("pemasukan") || query.includes("income") || query.includes("gaji")) {
    return `Total pemasukanku sejauh ini adalah ${formatRupiah(income)}.`
  }

  if (query.includes("terbesar") || query.includes("kategori") || query.includes("paling banyak")) {
    if (topCategoryAmount === 0) {
      return "Kamu belum mencatat pengeluaran apa pun."
    }
    return `Pengeluaran terbesar kamu ada di kategori **${topCategory}** sebanyak ${formatRupiah(topCategoryAmount)}.`
  }

  // Jawaban Default jika pertanyaan tidak dikenali
  if (transactions.length === 0) {
    return "Belum ada transaksi yang tercatat. Coba tambah transaksi dulu di Dashboard!"
  }

  return `Saat ini kamu punya ${transactions.length} transaksi tercatat. Total saldo: ${formatRupiah(balance)}.`
}