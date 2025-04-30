import { auth } from '@/auth'
import { getNotifications } from '@/lib/api/notification'
import NotificationList from './NotificationList'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { content: notifications } = await getNotifications(session.accessToken, { page: 0 })

  return (
    <>
      <h2>알림 페이지</h2>
      <NotificationList notifications={notifications} />
    </>
  )
}
