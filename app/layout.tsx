import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/money/theme-provider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Konfigurasi Viewport & Theme Color PWA
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d1b2a' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1b2a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Metadata Aplikasi + PWA Support
export const metadata: Metadata = {
  title: 'Money Guard',
  description: 'A simple, flat finance tracker',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Money Guard',
    startupImage: '/icon-pwa.png',
  },
  icons: {
    icon: '/icon-pwa.png',
    shortcut: '/icon-pwa.png',
    apple: '/icon-pwa.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}