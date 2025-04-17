'use client'

import { Certification } from '@/types/api/certification'
import Image from 'next/image'
import { updateCertificationStatusAction } from './actions'
import { useActionState } from 'react'

export default function CertificationItem({ certification }: { certification: Certification }) {
  const [state, formAction, isPending] = useActionState(updateCertificationStatusAction, {
    certification,
    message: '',
  })

  return (
    <form action={formAction}>
      <div className='rounded-lg border p-4 shadow-md'>
        <Image
          src={state.certification.certificationUrl}
          alt='Certification'
          width={100}
          height={100}
          className='mb-4 h-48 w-full object-cover'
        />
        <p>
          <strong>User ID:</strong> {state.certification.userId}
        </p>
        <p>
          <strong>Status:</strong> {state.certification.status}
        </p>
        {state.certification.rejectionReason && <p>{state.certification.rejectionReason}</p>}
        <p>
          <strong>Created At:</strong> {state.certification.createdAt}
        </p>
        {state.certification.status === 'PENDING' && (
          <div className='mt-4 flex flex-col gap-2'>
            <button
              className='btn btn-success'
              name='approve'
              value='true'
              type='submit'
              disabled={isPending}
            >
              {isPending ? '처리 중...' : '승인'}
            </button>
            <select
              className='select select-bordered'
              name='rejectionReason'
              defaultValue='UNIDENTIFIABLE_IMAGE'
            >
              <option value='UNIDENTIFIABLE_IMAGE'>식별 불가 이미지</option>
              <option value='WRONG_IMAGE'>잘못된 이미지</option>
              <option value='OTHER_MOVIE_IMAGE'>다른 영화 이미지</option>
            </select>
            <button
              className='btn btn-error'
              name='approve'
              value='false'
              type='submit'
              disabled={isPending}
            >
              {isPending ? '처리 중...' : '거절'}
            </button>
          </div>
        )}
        {state.message && <p className='text-sm'>{state.message}</p>}
      </div>
    </form>
  )
}
