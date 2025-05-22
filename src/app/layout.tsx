import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/layout/TopNav'
import BottomNav from '@/components/layout/BottomNav'
import { SessionProvider } from '@/providers/providers'
import SSEClient from '@/components/layout/SSEClient'
import { auth } from '@/auth'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Deepdiview',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang='ko'>
      <body className='flex min-h-screen flex-col'>
        <SessionProvider initialSession={session}>
          <SSEClient />
          <header>
            <TopNav />
          </header>
          <main className='flex flex-1 flex-col pb-2 md:pb-4'>{children}</main>
          <BottomNav />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
