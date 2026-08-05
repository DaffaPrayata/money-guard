import { finance, expenseBreakdown, formatRupiah } from "./money-data"

const savingTips: Record<string, string[]> = {
  "Food & Drinks": [
    "Cook at home a few days a week instead of ordering in.",
    "Set a weekly food budget and track each meal against it.",
    "Buy groceries with a list to avoid impulse snacks.",
  ],
  Shopping: [
    "Wait 24 hours before any non-essential purchase.",
    "Unsubscribe from store promo emails to reduce temptation.",
    "Set a monthly shopping cap and stick to it.",
  ],
  Transport: [
    "Combine errands into a single trip to save on fuel.",
    "Consider public transport or carpooling on busy routes.",
    "Track ride-hailing spend; it adds up quickly.",
  ],
}

function biggestCategory() {
  return expenseBreakdown.reduce((max, c) => (c.amount > max.amount ? c : max), expenseBreakdown[0])
}

function pct(curr: number, prev: number) {
  if (prev === 0) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

/**
 * Rule-based "Guard" assistant. Matches the user message against keywords
 * and returns an answer derived from the finance mock data. No LLM.
 */
export function getGuardReply(input: string): string {
  const q = input.toLowerCase().trim()
  const top = biggestCategory()
  const budgetLeft = finance.monthlyBudget - finance.currentExpense
  const balance = finance.income - finance.currentExpense

  // 5. Saving tips for [category]
  if (q.includes("tip") || q.includes("save") || q.includes("saving")) {
    const match = Object.keys(savingTips).find((cat) => q.includes(cat.toLowerCase().split(" ")[0]))
    const cat = match ?? top.name
    const tips = savingTips[cat] ?? savingTips["Food & Drinks"]
    return `Saving tips for ${cat}:\n• ${tips.join("\n• ")}`
  }

  // 6. Compare with last month
  if (q.includes("compare") || q.includes("last month")) {
    const change = pct(finance.currentExpense, finance.lastMonthExpense)
    const dir = change < 0 ? "less" : "more"
    return `This month you've spent ${formatRupiah(finance.currentExpense)}, versus ${formatRupiah(
      finance.lastMonthExpense,
    )} last month — that's ${Math.abs(change)}% ${dir}. ${
      change < 0 ? "Nice work trimming your spending!" : "Worth keeping an eye on."
    }`
  }

  // 1 & 4. Biggest / most wasteful expense
  if (
    q.includes("biggest") ||
    q.includes("wasteful") ||
    q.includes("most") ||
    (q.includes("highest") && q.includes("expense"))
  ) {
    return `Your biggest expense category is ${top.name} at ${formatRupiah(
      top.amount,
    )}. It's the first place to look if you want to cut back.`
  }

  // 2. Budget left
  if (q.includes("budget")) {
    const usedPct = Math.round((finance.currentExpense / finance.monthlyBudget) * 100)
    return `You have ${formatRupiah(budgetLeft)} left of your ${formatRupiah(
      finance.monthlyBudget,
    )} monthly budget. You've used ${usedPct}% so far.`
  }

  // 3. Balance
  if (q.includes("balance")) {
    return `Your current balance is ${formatRupiah(
      balance,
    )} (income ${formatRupiah(finance.income)} minus expenses ${formatRupiah(finance.currentExpense)}).`
  }

  // 7. Brief report
  if (q.includes("report") || q.includes("summary") || q.includes("overview")) {
    return [
      "Here's your month at a glance:",
      `• Balance: ${formatRupiah(balance)}`,
      `• Budget left: ${formatRupiah(budgetLeft)} of ${formatRupiah(finance.monthlyBudget)}`,
      `• Spent so far: ${formatRupiah(finance.currentExpense)}`,
      `• Biggest category: ${top.name} (${formatRupiah(top.amount)})`,
    ].join("\n")
  }

  return "I can help with your balance, budget, biggest expense, saving tips, a month-over-month comparison, or a quick report. Try one of the suggestions below."
}

export const guardSuggestions = [
  "What is my balance?",
  "How much budget is left?",
  "What is my biggest expense?",
  "Compare with last month",
  "Saving tips for Food",
  "Show me a brief report",
]
