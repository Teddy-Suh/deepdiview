import {
  CERTIFICATION_STATUS,
  getCertificationStatusLabel,
  getRejectionReasonLabel,
} from '@/constants/certification'
import { getRelativeTime } from '@/utils/date'
import { AdminCertification, UserCertification } from '@/types/api/certification'
import clsx from 'clsx'
import Image from 'next/image'
import { ReactNode } from 'react'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/styles.min.css'

export default function CertificationItemWrapper({
  certification,
  croppedImage,
  children,
}: {
  certification: UserCertification | AdminCertification
  croppedImage?: Blob | null
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        'space-y-2 rounded-3xl p-4',
        certification.status === CERTIFICATION_STATUS.NONE && 'bg-base-300',
        certification.status === CERTIFICATION_STATUS.APPROVED && 'bg-success/15',
        certification.status === CERTIFICATION_STATUS.PENDING && 'bg-warning/15',
        certification.status === CERTIFICATION_STATUS.REJECTED && 'bg-error/15'
      )}
    >
      {certification.status !== CERTIFICATION_STATUS.NONE && certification.certificationDetails && (
        <>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex shrink-0 items-center gap-2'>
              {certification.userInformation ? (
                <>
                  <Image
                    src={`${certification.userInformation.profileImageUrl}`}
                    alt='프로필 사진'
                    width={33}
                    height={33}
                    className='aspect-square rounded-full'
                  />
                  <div>
                    <div className='flex items-center gap-1'>
                      <p className='text-sm'>{certification.userInformation.userNickname}</p>
                    </div>
                    <p className='text-xs text-gray-400'>
                      {getRelativeTime(certification.certificationDetails.createdAt)}
                    </p>
                  </div>
                </>
              ) : (
                <p className='text-gray-400'>
                  {getRelativeTime(certification.certificationDetails.createdAt)}
                </p>
              )}
            </div>
            <div
              className={clsx(
                'badge badge-soft rounded-full py-3.5',
                certification.status === CERTIFICATION_STATUS.APPROVED && 'badge-success',
                certification.status === CERTIFICATION_STATUS.PENDING && 'badge-warning',
                certification.status === CERTIFICATION_STATUS.REJECTED && 'badge-error'
              )}
            >
              <span className='line-clamp-1'>
                {getCertificationStatusLabel(certification.status)}
                {certification.certificationDetails.rejectionReason &&
                  ` - ${getRejectionReasonLabel(certification.certificationDetails.rejectionReason)}`}
              </span>
            </div>
          </div>
        </>
      )}
      <div className='bg-base-100 relative flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl'>
        {certification.certificationDetails?.certificationUrl || croppedImage ? (
          <InnerImageZoom
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : (certification.certificationDetails?.certificationUrl ?? '')
            }
            zoomSrc={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : (certification.certificationDetails?.certificationUrl ?? '')
            }
            imgAttributes={{
              className: 'max-h-80',
            }}
            hideHint
            hideCloseButton
          />
        ) : (
          '시청 인증샷을 제출해 주세요!'
        )}
      </div>
      <div className='mt-4'>{children}</div>
    </div>
  )
}
