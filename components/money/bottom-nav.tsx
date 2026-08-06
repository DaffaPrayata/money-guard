"use client"

import Link from "next/link"
import { Home, Bot, History, MoreHorizontal } from "lucide-react"

type Active = "home" | "guard" | "history" | "more"

const items: { key: Active; label: string; href: string; Icon: typeof Home }[] = [
  { key: "home", label: "Home", href: "/dashboard", Icon: Home },
  { key: "guard", label: "Guard", href: "/assistant", Icon: Bot },
  { key: "history", label: "History", href: "/history", Icon: History },
  { key: "more", label: "More", href: "/more", Icon: MoreHorizontal },
]

export function BottomNav({ active }: { active: Active }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-[#1a1a1a] border-t border-[#e5e5e5] dark:border-[#0d2b4a] transition-colors">
      <div className="flex justify-around py-3">
        {items.map(({ key, label, href, Icon }) => {
          const isActive = key === active
          const color = isActive ? "#1e3a5f" : "#737373"
          return (
            <Link key={key} href={href} className="flex flex-col items-center gap-1" style={{ color }}>
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
