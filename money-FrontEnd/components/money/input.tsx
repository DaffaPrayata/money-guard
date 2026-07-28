import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-[#525252] dark:text-[#999999]">{label}</label>}
      <input
        className={`w-full border border-[#e5e5e5] dark:border-[#0d2b4a] rounded-md px-3 py-2.5 text-sm bg-white dark:bg-[#0d2b4a] text-[#1a1a1a] dark:text-[#f5f5f5] outline-none focus:border-[#1e3a5f] placeholder-[#737373] dark:placeholder-[#999999] ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#ef4444]">{error}</span>}
    </div>
  )
}
