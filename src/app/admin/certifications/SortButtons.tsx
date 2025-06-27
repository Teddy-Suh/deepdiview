'use client'

import SortButton from '@/components/ui/SortButton'
import {
  CERTIFICATION_STATUS,
  CertificationStatus,
  getCertificationStatusBtnLabel,
} from '@/constants/certification'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default function SortButtons({ status }: { status?: CertificationStatus }) {
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setIsPending(false)
  }, [status])

  return (
    <div className='dropdown dropdown-center'>
      <div
        className={clsx('btn btn-primary', isPending && 'btn-disabled text-primary')}
        tabIndex={0}
        role='button'
      >
        {isPending ? (
          <span className='loading loading-ring' />
        ) : (
          getCertificationStatusBtnLabel(status)
        )}
      </div>
      <div
        className='menu dropdown-content bg-base-300 mt-2 space-y-2 rounded-3xl shadow-sm'
        tabIndex={0}
      >
        <SortButton
          pathPrefix='/admin/certifications'
          queryKey='status'
          targetValue={CERTIFICATION_STATUS.PENDING}
          currentValue={status || ''}
          label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.PENDING)}
          setIsPending={setIsPending}
        />
        <SortButton
          pathPrefix='/admin/certifications'
          queryKey='status'
          targetValue={CERTIFICATION_STATUS.APPROVED}
          currentValue={status || ''}
          label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}
          setIsPending={setIsPending}
        />
        <SortButton
          pathPrefix='/admin/certifications'
          queryKey='status'
          targetValue={CERTIFICATION_STATUS.REJECTED}
          currentValue={status || ''}
          label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}
          setIsPending={setIsPending}
        />
        <SortButton
          pathPrefix='/admin/certifications'
          queryKey='status'
          targetValue={''}
          currentValue={status || ''}
          label={getCertificationStatusBtnLabel(undefined)}
          setIsPending={setIsPending}
        />
      </div>
    </div>
  )
}
