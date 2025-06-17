'use client'

import { useEffect, useRef, useState } from 'react'
import { Session } from 'next-auth'
import { AdminCertification } from '@/types/api/certification'
import { getCertifications } from '@/lib/api/certification'
import { CertificationStatus } from '@/types/api/common'
import CertificationForm from './CertificationForm'

export default function CertificationList({
  session,
  initialCertifications,
  initialLast,
  initialNextCreatedAt,
  initialNextId,
  status,
}: {
  session: Session
  initialCertifications: AdminCertification[]
  initialLast: boolean
  initialNextCreatedAt: string
  initialNextId: number
  status?: CertificationStatus
}) {
  const [certifications, setCertifications] = useState<AdminCertification[]>([])
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>()
  const [createdAt, setCreatedAt] = useState<string>()
  const [certificationId, setCertificationId] = useState<number>()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    setCertifications(initialCertifications)
    setPage(1)
    setHasMore(!initialLast)
    setCreatedAt(initialNextCreatedAt)
    setCertificationId(initialNextId)
  }, [initialLast, initialCertifications, initialNextCreatedAt, initialNextId])

  useEffect(() => {
    const target = loaderRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          setIsFetching(true)

          console.log('certificationId', certificationId)
          const res = await getCertifications(session?.accessToken, {
            createdAt: createdAt,
            certificationId: certificationId,
            status,
            page,
            size: 12,
          })

          setCertifications((prev) => [...prev, ...res.content] as typeof prev)
          setIsFetching(false)
          isFetchingRef.current = false

          setPage((prev) => prev + 1)
          if (!res.hasNext) setHasMore(false)
          setCreatedAt(res.nextCreatedAt)
          setCertificationId(res.nextId)
        }
      },
      {
        threshold: 0.3,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [certificationId, createdAt, hasMore, page, session?.accessToken, status])

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {certifications.map((certification) => (
          <CertificationForm
            key={certification.certificationDetails.id}
            initialCertification={certification}
          />
        ))}
      </div>
      {isFetching && (
        <div className='mt-2 w-full text-center md:mt-3'>
          <span className='loading loading-ring loading-xl text-primary' />
        </div>
      )}
      {hasMore && <div ref={loaderRef} className='h-1 w-full opacity-0' />}
    </>
  )
}
