import { auth } from '@/auth'
import NotificationList from './NotificationList'
import { redirect } from 'next/navigation'

export const metadata = {
  title: '알림',
}

export default async function NotificationsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return <NotificationList session={session} />
}
