'use client'

import Link from 'next/link'
import { ChevronRight, Grid3x3, Settings, Download } from 'lucide-react'
import { BottomNav } from '@/components/money/bottom-nav'

export default function MorePage() {
  const menuItems = [
    {
      icon: Grid3x3,
      label: 'Categories & Budget',
      description: 'Manage categories and set budgets',
      href: '/categories',
    },
    {
      icon: Settings,
      label: 'Profile & Settings',
      description: 'Update your profile and preferences',
      href: '/profile',
    },
    {
      icon: Download,
      label: 'Export Data',
      description: 'Download your financial data',
      href: '/profile',
    },
  ]

  return (
    <main className="max-w-[480px] mx-auto bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] dark:border-[#0d2b4a] p-4 bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">More</h1>
      </header>

      {/* Content */}
      <div className="p-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-4 rounded-lg bg-[#f5f5f5] dark:bg-[#0d2b4a] hover:opacity-80 transition-opacity"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <Icon
                  size={24}
                  className="text-[#1e3a5f] dark:text-[#06b6d4]"
                  strokeWidth={1.5}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#1a1a1a] dark:text-[#f5f5f5] text-sm">
                  {item.label}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#999999] mt-0.5 truncate">
                  {item.description}
                </p>
              </div>

              {/* Chevron */}
              <div className="flex-shrink-0">
                <ChevronRight
                  size={20}
                  className="text-[#737373] dark:text-[#999999]"
                  strokeWidth={2}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <BottomNav active="more" />
    </main>
  )
}
