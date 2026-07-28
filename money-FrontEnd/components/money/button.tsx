import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
}

const styles: Record<Variant, string> = {
  primary: "bg-[#1e3a5f] text-white border border-[#1e3a5f]",
  secondary: "bg-white text-[#1a1a1a] border border-[#e5e5e5]",
  danger: "bg-[#ef4444] text-white border border-[#ef4444]",
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
