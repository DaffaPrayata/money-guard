"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "./button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  onConfirm?: () => void
}

export function Modal({ isOpen, onClose, title, children, onConfirm }: ModalProps) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-white dark:bg-[#1a1a1a] rounded-lg border border-[#e5e5e5] dark:border-[#0d2b4a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e5] dark:border-[#0d2b4a] px-4 py-3">
          <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#737373] dark:text-[#999999]">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-4 text-[#1a1a1a] dark:text-[#f5f5f5]">{children}</div>
        <div className="flex justify-end gap-2 border-t border-[#e5e5e5] dark:border-[#0d2b4a] px-4 py-3">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm}>
              Simpan
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
