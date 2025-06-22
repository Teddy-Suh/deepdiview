import { BadgeCheck } from 'lucide-react'

export default function CertifiedBadge() {
  return (
    <div className='badge badge-primary h-5 w-5 rounded-full border-2 p-0'>
      <BadgeCheck className='stroke-base-100' />
    </div>
  )
}
