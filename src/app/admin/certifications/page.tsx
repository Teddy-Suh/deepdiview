import { auth } from '@/auth'
import { getCertifications } from '@/lib/api/certification'
import { redirect } from 'next/navigation'
import CertificationList from './CertificationList'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import {
  CERTIFICATION_STATUS,
  CertificationStatus,
  getCertificationStatusBtnLabel,
} from '@/constants/certification'

import { getIsSunday } from '@/lib/api/discussion'
import SortButton from '@/components/ui/SortButton'

export default async function AdminCertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: CertificationStatus }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { isSunday } = await getIsSunday()
  if (isSunday) redirect(`/admin`)

  if (session.user?.role !== 'ADMIN') redirect('/')

  const { status } = await searchParams

  const certifications = await getCertifications(session.accessToken, {
    status,
    page: 0,
    size: 12,
  })

  return (
    <>
      <GoBackHeader>
        <h2 className='line-clamp-1 flex-1 text-xl font-semibold'>시청 인증 관리</h2>
        <div className='dropdown dropdown-center'>
          <div className='btn btn-primary' tabIndex={0} role='button'>
            {getCertificationStatusBtnLabel(status)}
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
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={CERTIFICATION_STATUS.APPROVED}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={CERTIFICATION_STATUS.REJECTED}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={''}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(undefined)}
            />
          </div>
        </div>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>
            시청 인증 관리
          </h2>
          <div className='hidden space-x-3 md:block'>
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={CERTIFICATION_STATUS.PENDING}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.PENDING)}
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={CERTIFICATION_STATUS.APPROVED}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={CERTIFICATION_STATUS.REJECTED}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}
            />
            <SortButton
              pathPrefix='/admin/certifications'
              queryKey='status'
              targetValue={''}
              currentValue={status || ''}
              label={getCertificationStatusBtnLabel(undefined)}
            />
          </div>
        </div>
        {certifications.content.length === 0 ? (
          <>시청 인증이 없습니다.</>
        ) : (
          <CertificationList
            session={session}
            initialCertifications={certifications.content}
            initialLast={!certifications.hasNext}
            initialNextCreatedAt={certifications.nextCreatedAt}
            initialNextId={certifications.nextId}
            status={status}
          />
        )}
      </div>
    </>
  )
}
