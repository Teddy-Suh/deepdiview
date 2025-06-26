import './globals.css'
import TopNav from '@/components/layout/TopNav'
import BottomNav from '@/components/layout/BottomNav'
import { SessionProvider } from '@/providers/providers'
import NotificationClient from '@/components/layout/NotificationClient'
import { auth } from '@/auth'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import localFont from 'next/font/local'

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
})

export const metadata = {
  title: {
    default: 'Deepdiview',
    template: '%s | Deepdiview',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang='ko' className={pretendard.className}>
      <body className='flex min-h-screen flex-col'>
        <SessionProvider initialSession={session}>
          <NotificationClient />
          <Toaster position='top-center' />
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
