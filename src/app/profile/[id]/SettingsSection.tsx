import Link from 'next/link'
import { signOutAction } from './actions'
import LogoutButton from './LogoutButton'

export default function SettingsSection({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section className='mt-4 w-full'>
      <div className='bg-base-300 rounded-2xl p-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Link className='btn btn-soft w-full rounded-2xl' href='/profile/update-password'>
            비밀번호 변경
          </Link>

          {isAdmin ? (
            <Link className='btn btn-soft w-full rounded-2xl' href='/admin'>
              관리자 페이지
            </Link>
          ) : (
            <Link className='btn btn-soft rounded-2xl' href='/profile/delete-account'>
              회원 탈퇴
            </Link>
          )}
          <form action={signOutAction} className='col-span-1 md:col-span-full lg:col-span-1'>
            <LogoutButton />
          </form>
        </div>
      </div>
    </section>
  )
}
