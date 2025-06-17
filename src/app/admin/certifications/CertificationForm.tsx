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
      message: '',
    }
  )

  useEffect(() => {
    setCertifications(state.certification)
  }, [state.certification])

  // '인증요청이 존재하지 않습니다.'와 같은 오류는 전체 에러 페이지로 처리하지 않음
  // 서버 액션 결과로 certification이 null이면, 해당 항목만 UI에서 제거
  // TODO: 토스트 메세지로 에러 메세지 띄우기
  if (certification === null) return <></>

  return (
    <>
      <CertificationItemWrapper certification={certification}>
        {certification.status === CERTIFICATION_STATUS.PENDING && (
          <form action={formAction}>
            <div className='space-y-2'>
              <button
                className='btn btn-success w-full rounded-2xl'
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
                className='select select-error w-full rounded-2xl text-center focus:outline-none'
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
                className='btn btn-error w-full rounded-2xl'
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
      {/* TODO: 토스트 메세지로 에러 메세지 띄우기 */}
      {state.message && <>{state.message}</>}
    </>
  )
}
