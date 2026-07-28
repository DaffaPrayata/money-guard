"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send } from "lucide-react"
import { BottomNav } from "@/components/money/bottom-nav"
import { getGuardReply, guardSuggestions } from "@/lib/guard-logic"

type Msg = { id: number; from: "user" | "guard"; text: string }

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "guard", text: "Hi, I'm Guard. Ask me about your money and I'll help you out." },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function send(text: string) {
    const value = text.trim()
    if (!value || typing) return
    const userMsg: Msg = { id: nextId.current++, from: "user", text: value }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)
    const reply = getGuardReply(value)
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "guard", text: reply }])
      setTyping(false)
    }, 700)
  }

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen flex flex-col transition-colors">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">Guard</h1>
          <p className="text-xs text-[#737373] dark:text-[#999999]">Your personal finance assistant</p>
        </div>
      </header>

      {/* Chat */}
      <section className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-2 bg-white dark:bg-[#1a1a1a]">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                m.from === "user"
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-[#f5f5f5] dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] border border-[#e5e5e5] dark:border-[#0d2b4a]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[#f5f5f5] dark:bg-[#0d2b4a] border border-[#e5e5e5] dark:border-[#0d2b4a] text-[#737373] dark:text-[#999999] rounded-lg px-3 py-2 text-sm">
              Guard is thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </section>

      {/* Suggestions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto bg-white dark:bg-[#1a1a1a]">
        {guardSuggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="whitespace-nowrap text-xs text-[#1e3a5f] border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-full px-3 py-1.5 hover:bg-[#f5f5f5] dark:hover:bg-[#0d2b4a] transition-colors"
          >
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
        className="flex items-center gap-2 border-t border-[#e5e5e5] dark:border-[#0d2b4a] p-3 mb-16 bg-white dark:bg-[#1a1a1a]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Guard..."
          className="flex-1 border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] bg-white dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] placeholder-[#737373] dark:placeholder-[#999999]"
        />
        <button
          type="submit"
          aria-label="Send"
          className="w-10 h-10 rounded-md bg-[#1e3a5f] text-white flex items-center justify-center disabled:opacity-50"
          disabled={!input.trim() || typing}
        >
          <Send size={18} />
        </button>
      </form>

      <BottomNav active="guard" />
    </main>
  )
}
