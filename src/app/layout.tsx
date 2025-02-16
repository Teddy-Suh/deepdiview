import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Deepdiview',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body>
        <header>
          <TopNav />
        </header>
        {children}
      </body>
    </html>
  )
}
