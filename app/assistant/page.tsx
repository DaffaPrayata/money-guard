"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, Sparkles } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { getGuardReply, guardSuggestions } from "@/lib/guard-logic"

type Msg = { id: number; from: "user" | "guard"; text: string; time: string }

interface Transaction {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  account: "Cash" | "Bank account"
  date: string
}

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "guard",
      text: "Hi, I'm Guard. Ask me about your money and I'll help you out.",
      time: timestamp(),
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(2)

  // Load real data from LocalStorage when the page opens
  useEffect(() => {
    const saved = localStorage.getItem("money_guard_transactions")
    if (saved) {
      try {
        setTransactions(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse transactions for assistant", e)
      }
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, typing])

  function send(text: string) {
    const value = text.trim()
    if (!value || typing) return
    const userMsg: Msg = { id: nextId.current++, from: "user", text: value, time: timestamp() }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)

    // Call Guard with live transaction data so replies reflect the real balance
    const reply = getGuardReply(value, transactions)

    const delay = 500 + Math.random() * 400
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "guard", text: reply, time: timestamp() }])
      setTyping(false)
      inputRef.current?.focus()
    }, delay)
  }

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#141414] min-h-[100dvh] flex flex-col transition-colors">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#ececec] dark:border-[#1f1f1f] px-4 py-3.5 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2a4d7a] to-[#152a44] text-white flex items-center justify-center shadow-sm">
            <Bot size={20} strokeWidth={2.2} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-white dark:border-[#141414]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] leading-tight">Guard</h1>
          <p className="text-xs text-[#22c55e] dark:text-[#4ade80] leading-tight font-medium">Online · Your finance assistant</p>
        </div>
      </header>

      {/* Chat */}
      <section
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#fafafa] dark:bg-[#141414]"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.map((m, i) => {
          const showAvatar = m.from === "guard" && (i === 0 || messages[i - 1].from !== "guard")
          return (
            <div key={m.id} className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              {m.from === "guard" && (
                <div className={`w-6 h-6 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                  <Bot size={13} />
                </div>
              )}
              <div className="flex flex-col max-w-[76%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line shadow-sm ${
                    m.from === "user"
                      ? "bg-[#1e3a5f] text-white rounded-br-md"
                      : "bg-white dark:bg-[#1e1e1e] text-[#1a1a1a] dark:text-[#f5f5f5] border border-[#ececec] dark:border-[#2a2a2a] rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
                <span
                  className={`text-[10px] text-[#a3a3a3] dark:text-[#666666] mt-1 px-1 ${
                    m.from === "user" ? "self-end" : "self-start"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          )
        })}
        {typing && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0">
              <Bot size={13} />
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] border border-[#ececec] dark:border-[#2a2a2a] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] dark:bg-[#666666] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] dark:bg-[#666666] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] dark:bg-[#666666] animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </section>

      {/* Suggestions */}
      <div
        className="px-4 py-2.5 flex gap-2 overflow-x-auto bg-white dark:bg-[#141414] border-t border-[#ececec] dark:border-[#1f1f1f]"
        style={{ scrollbarWidth: "none" }}
      >
        {guardSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={typing}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#1e3a5f] dark:text-[#93c5fd] bg-[#f0f4f8] dark:bg-[#1e2a3a] border border-transparent rounded-full px-3.5 py-2 hover:bg-[#e2e9f0] dark:hover:bg-[#25344a] active:scale-[0.97] transition-all disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/40"
          >
            <Sparkles size={12} className="opacity-70" />
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2 border-t border-[#ececec] dark:border-[#1f1f1f] px-3 py-2.5 bg-white dark:bg-[#141414]"
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Guard about your money..."
          disabled={typing}
          aria-label="Message Guard"
          className="flex-1 border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/15 bg-[#fafafa] dark:bg-[#1e1e1e] text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#a3a3a3] dark:placeholder-[#737373] transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-11 h-11 shrink-0 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shadow-sm disabled:opacity-40 disabled:pointer-events-none hover:bg-[#254a75] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/40 focus-visible:ring-offset-2"
          disabled={!input.trim() || typing}
        >
          <Send size={17} />
        </button>
      </form>

      <BottomNav active="guard" />
    </main>
  )
}