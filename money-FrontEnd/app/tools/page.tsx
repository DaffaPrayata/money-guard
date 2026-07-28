"use client"

import { useState } from "react"
import { Target, PiggyBank, Wallet, Handshake, Trophy, Settings } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { Modal } from "@/components/money/modal"
import { ProgressBar } from "@/components/money/progress-bar"
import { finance, formatRupiah } from "@/lib/money-data"

type ToolKey = "budget" | "savings" | "debt" | "lend" | "challenge" | "settings"

const tools: { key: ToolKey; title: string; Icon: typeof Target; desc: string }[] = [
  { key: "budget", title: "Budget", Icon: Target, desc: "Set spending limits" },
  { key: "savings", title: "Savings", Icon: PiggyBank, desc: "Reach your goals" },
  { key: "debt", title: "Debt", Icon: Wallet, desc: "Track what you owe" },
  { key: "lend", title: "Lend / Borrow", Icon: Handshake, desc: "Money in & out" },
  { key: "challenge", title: "Challenge", Icon: Trophy, desc: "Compete with friends" },
  { key: "settings", title: "Settings", Icon: Settings, desc: "Export, reset, theme" },
]

const savingsGoals = [
  { name: "New laptop", target: 12_000_000, saved: 7_500_000 },
  { name: "Emergency fund", target: 6_000_000, saved: 2_400_000 },
]

const debts = [
  { name: "Phone installment", amount: 1_200_000, due: "May 25", paid: false },
  { name: "Friend loan", amount: 300_000, due: "May 10", paid: true },
]

const lends = [
  { name: "Andi", amount: 250_000, returned: false },
  { name: "Sari", amount: 100_000, returned: true },
]

const leaderboard = [
  { name: "Budi (You)", saved: 1_250_000 },
  { name: "Andi", saved: 980_000 },
  { name: "Sari", saved: 870_000 },
  { name: "Dewi", saved: 540_000 },
]

function StatusPill({ ok, okLabel, noLabel }: { ok: boolean; okLabel: string; noLabel: string }) {
  return (
    <span
      className="text-xs rounded-full px-2 py-0.5 border"
      style={{
        color: ok ? "#10b981" : "#ef4444",
        borderColor: ok ? "#10b981" : "#ef4444",
      }}
    >
      {ok ? okLabel : noLabel}
    </span>
  )
}

export default function ToolsPage() {
  const [active, setActive] = useState<ToolKey | null>(null)
  const budgetLeft = finance.monthlyBudget - finance.currentExpense

  const titles: Record<ToolKey, string> = {
    budget: "Budget",
    savings: "Savings Goals",
    debt: "Debt Tracker",
    lend: "Lend / Borrow",
    challenge: "Saving Challenge",
    settings: "Tools Settings",
  }

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Money Tools</h1>
        <p className="text-xs text-[#737373] dark:text-[#999999] mt-0.5">Everything to manage your money</p>
      </header>

      <section className="p-4 grid grid-cols-2 gap-3">
        {tools.map(({ key, title, Icon, desc }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="text-left border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-lg p-4 flex flex-col gap-2 hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1e3a5f] flex items-center justify-center">
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f5f5]">{title}</span>
            <span className="text-xs text-[#737373] dark:text-[#999999]">{desc}</span>
          </button>
        ))}
      </section>

      <Modal isOpen={active !== null} onClose={() => setActive(null)} title={active ? titles[active] : ""}>
        {active === "budget" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#737373] dark:text-[#999999]">Monthly budget</span>
              <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">{formatRupiah(finance.monthlyBudget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373] dark:text-[#999999]">Spent</span>
              <span className="text-[#ef4444]">{formatRupiah(finance.currentExpense)}</span>
            </div>
            <ProgressBar value={finance.currentExpense} max={finance.monthlyBudget} color="#ef4444" />
            <div className="flex justify-between text-sm">
              <span className="text-[#737373] dark:text-[#999999]">Remaining</span>
              <span className="text-[#10b981]">{formatRupiah(budgetLeft)}</span>
            </div>
          </div>
        )}

        {active === "savings" && (
          <div className="flex flex-col gap-4">
            {savingsGoals.map((g) => (
              <div key={g.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a] dark:text-[#f5f5f5]">{g.name}</span>
                  <span className="text-[#737373] dark:text-[#999999]">
                    {formatRupiah(g.saved)} / {formatRupiah(g.target)}
                  </span>
                </div>
                <ProgressBar value={g.saved} max={g.target} color="#10b981" />
              </div>
            ))}
          </div>
        )}

        {active === "debt" && (
          <div className="flex flex-col gap-3">
            {debts.map((d) => (
              <div key={d.name} className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{d.name}</div>
                  <div className="text-xs text-[#737373] dark:text-[#999999]">
                    {formatRupiah(d.amount)} · due {d.due}
                  </div>
                </div>
                <StatusPill ok={d.paid} okLabel="Paid" noLabel="Unpaid" />
              </div>
            ))}
          </div>
        )}

        {active === "lend" && (
          <div className="flex flex-col gap-3">
            {lends.map((l) => (
              <div key={l.name} className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{l.name}</div>
                  <div className="text-xs text-[#737373] dark:text-[#999999]">{formatRupiah(l.amount)}</div>
                </div>
                <StatusPill ok={l.returned} okLabel="Returned" noLabel="Not returned" />
              </div>
            ))}
          </div>
        )}

        {active === "challenge" && (
          <div className="flex flex-col gap-2">
            {leaderboard.map((p, i) => (
              <div
                key={p.name}
                className="flex justify-between items-center py-1.5 border-b border-[#f0f0f0] dark:border-[#0d2b4a] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-sm text-[#737373] dark:text-[#999999]">{i + 1}</span>
                  <span className="text-sm text-[#1a1a1a] dark:text-[#f5f5f5]">{p.name}</span>
                </div>
                <span className="text-sm text-[#10b981]">{formatRupiah(p.saved)}</span>
              </div>
            ))}
          </div>
        )}

        {active === "settings" && (
          <div className="flex flex-col gap-2">
            <button className="text-left text-sm text-[#1a1a1a] dark:text-[#f5f5f5] py-2 border-b border-[#f0f0f0] dark:border-[#0d2b4a]">
              Export data (CSV)
            </button>
            <button className="text-left text-sm text-[#1a1a1a] dark:text-[#f5f5f5] py-2 border-b border-[#f0f0f0] dark:border-[#0d2b4a]">
              Reset all data
            </button>
            <button className="text-left text-sm text-[#1a1a1a] dark:text-[#f5f5f5] py-2">Theme</button>
          </div>
        )}
      </Modal>

      <BottomNav active="home" />
    </main>
  )
}
