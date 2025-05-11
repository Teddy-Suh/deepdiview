import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function getRelativeTime(dateString: string) {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ko,
  })
}
