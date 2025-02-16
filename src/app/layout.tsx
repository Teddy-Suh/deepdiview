import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'
import BottomNav from '@/components/BottomNav'

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
        <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8'>
          <header>
            <TopNav />
          </header>
          <main>{children}</main>
          <footer>
            <BottomNav />
          </footer>
        </div>
      </body>
    </html>
  )
}
