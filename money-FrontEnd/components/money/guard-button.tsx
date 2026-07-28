'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import { Modal } from './modal'

export function GuardButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Open Guard assistant"
      >
        <Bot size={24} />
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Guard Assistant"
      >
        <div className="space-y-3">
          <p className="text-sm text-[#737373]">
            Your personal finance assistant. Tap a question below or ask anything about your money.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                // Guard logic would go here
                setOpen(false)
              }}
              className="text-left p-3 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] text-sm text-[#1a1a1a] dark:text-[#f5f5f5] hover:bg-[#e5e5e5] dark:hover:bg-[#1e3a5f] transition-colors"
            >
              What is my current balance?
            </button>
            <button
              onClick={() => {
                setOpen(false)
              }}
              className="text-left p-3 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] text-sm text-[#1a1a1a] dark:text-[#f5f5f5] hover:bg-[#e5e5e5] dark:hover:bg-[#1e3a5f] transition-colors"
            >
              How much can I still spend this month?
            </button>
            <button
              onClick={() => {
                setOpen(false)
              }}
              className="text-left p-3 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] text-sm text-[#1a1a1a] dark:text-[#f5f5f5] hover:bg-[#e5e5e5] dark:hover:bg-[#1e3a5f] transition-colors"
            >
              What was my biggest expense?
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
