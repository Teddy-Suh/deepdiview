'use client'

import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { getServerSession } from '../lib/actions/auth'

const SessionContent = createContext<Session | null>(null)

export function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(initialSession)

  useEffect(() => {
    getServerSession().then((res) => {
      setSession(res)
    })
  }, [pathname])

  return <SessionContent.Provider value={session}>{children}</SessionContent.Provider>
}

export function useSession() {
  return useContext(SessionContent)
}
