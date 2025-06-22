'use client'

import { AdminCertification } from '@/types/api/certification'
import { updateCertificationStatusAction } from './actions'
import { useActionState, useEffect, useState } from 'react'
import CertificationItemWrapper from '@/components/ui/CertificationItemWrapper'
import {
  CERTIFICATION_REJECTION_REASONS,
  CERTIFICATION_STATUS,
  getCertificationStatusBtnLabel,
  getRejectionReasonLabel,
} from '@/constants/certification'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { CERTIFICATION_CODES, CERTIFICATION_MESSAGES } from '@/constants/messages/certification'

export default function CertificationForm({
  initialCertification,
}: {
  initialCertification: AdminCertification
}) {
  const [certification, setCertifications] = useState<AdminCertification | null>(
    initialCertification
  )
  const [state, formAction, isPending] = useActionState(
    updateCertificationStatusAction.bind(
      null,
      initialCertification.certificationDetails.id.toString()
    ),
    {
      certification,
      code: '',
    }
  )

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.SUCCESS) {
      setCertifications(state.certification)
      return
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (state.code === CERTIFICATION_CODES.CERTIFICATION_NOT_FOUND) {
      toast.error(CERTIFICATION_MESSAGES.CERTIFICATION_NOT_FOUND)
      setCertifications(state.certification)
      return
    }
  }, [state])

  if (certification === null) return <></>

  return (
    <>
      <CertificationItemWrapper certification={certification}>
        {certification.status === CERTIFICATION_STATUS.PENDING && (
          <form action={formAction}>
            <div className='space-y-2'>
              <button
                className='btn btn-success w-full'
                name='approve'
                value='true'
                type='submit'
                disabled={isPending}
              >
                {isPending ? (
                  <span className='loading loading-ring' />
                ) : (
                  <>{getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}</>
                )}
              </button>
              <select
                className='select select-error w-full text-center focus:outline-none'
                name='rejectionReason'
                defaultValue={CERTIFICATION_REJECTION_REASONS.UNIDENTIFIABLE_IMAGE}
                disabled={isPending}
              >
                <option value={CERTIFICATION_REJECTION_REASONS.UNIDENTIFIABLE_IMAGE}>
                  {getRejectionReasonLabel(CERTIFICATION_REJECTION_REASONS.UNIDENTIFIABLE_IMAGE)}
                </option>
                <option value={CERTIFICATION_REJECTION_REASONS.WRONG_IMAGE}>
                  {getRejectionReasonLabel(CERTIFICATION_REJECTION_REASONS.WRONG_IMAGE)}
                </option>
                <option value={CERTIFICATION_REJECTION_REASONS.OTHER_MOVIE_IMAGE}>
                  {getRejectionReasonLabel(CERTIFICATION_REJECTION_REASONS.OTHER_MOVIE_IMAGE)}
                </option>
              </select>
              <button
                className='btn btn-error w-full'
                name='approve'
                value='false'
                type='submit'
                disabled={isPending}
              >
                {isPending ? (
                  <span className='loading loading-ring' />
                ) : (
                  <>{getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}</>
                )}
              </button>
            </div>
          </form>
        )}
      </CertificationItemWrapper>
    </>
  )
}
