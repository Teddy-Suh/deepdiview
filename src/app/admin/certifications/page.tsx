import { auth } from '@/auth'
import { getCertifications } from '@/lib/api/certification'
import { redirect } from 'next/navigation'
import CertificationList from './CertificationList'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import clsx from 'clsx'
import Link from 'next/link'
import {
  CERTIFICATION_STATUS,
  CertificationStatus,
  getCertificationStatusBtnLabel,
} from '@/constants/certification'

import { getIsSunday } from '@/lib/api/discussion'

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
          <ul
            className='menu dropdown-content bg-base-300 mt-2 space-y-2 rounded-3xl shadow-sm'
            tabIndex={0}
          >
            <li>
              <Link
                className={clsx(
                  'btn btn-primary w-[60px]',
                  status === CERTIFICATION_STATUS.PENDING ? 'pointer-events-none' : 'btn-soft'
                )}
                href={`/admin/certifications?status=${CERTIFICATION_STATUS.PENDING}`}
              >
                {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.PENDING)}
              </Link>
            </li>
            <li>
              <Link
                className={clsx(
                  'btn btn-primary',
                  status === CERTIFICATION_STATUS.APPROVED ? 'pointer-events-none' : 'btn-soft'
                )}
                href={`/admin/certifications?status=${CERTIFICATION_STATUS.APPROVED}`}
              >
                {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}
              </Link>
            </li>
            <li>
              <Link
                className={clsx(
                  'btn btn-primary',
                  status === CERTIFICATION_STATUS.REJECTED ? 'pointer-events-none' : 'btn-soft'
                )}
                href={`/admin/certifications?status=${CERTIFICATION_STATUS.REJECTED}`}
              >
                {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}
              </Link>
            </li>
            <li>
              <Link
                className={clsx(
                  'btn btn-primary',
                  status === undefined ? 'pointer-events-none' : 'btn-soft'
                )}
                href='/admin/certifications'
              >
                {getCertificationStatusBtnLabel(undefined)}
              </Link>
            </li>
          </ul>
        </div>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>
            시청 인증 관리
          </h2>
          <div className='hidden space-x-3 md:block'>
            <Link
              className={clsx(
                'btn btn-primary',
                status === CERTIFICATION_STATUS.PENDING ? 'pointer-events-none' : 'btn-soft'
              )}
              href={`/admin/certifications?status=${CERTIFICATION_STATUS.PENDING}`}
            >
              {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.PENDING)}
            </Link>
            <Link
              className={clsx(
                'btn btn-primary',
                status === CERTIFICATION_STATUS.APPROVED ? 'pointer-events-none' : 'btn-soft'
              )}
              href={`/admin/certifications?status=${CERTIFICATION_STATUS.APPROVED}`}
            >
              {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.APPROVED)}
            </Link>
            <Link
              className={clsx(
                'btn btn-primary',
                status === CERTIFICATION_STATUS.REJECTED ? 'pointer-events-none' : 'btn-soft'
              )}
              href={`/admin/certifications?status=${CERTIFICATION_STATUS.REJECTED}`}
            >
              {getCertificationStatusBtnLabel(CERTIFICATION_STATUS.REJECTED)}
            </Link>
            <Link
              className={clsx(
                'btn btn-primary',
                status === undefined ? 'pointer-events-none' : 'btn-soft'
              )}
              href='/admin/certifications'
            >
              {getCertificationStatusBtnLabel(undefined)}
            </Link>
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
