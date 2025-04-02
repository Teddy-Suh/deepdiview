import { auth } from '@/auth'
import { signOutWithForm } from './actions'

export default async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  const session = await auth()
  const userId = session.user.userId
  return (
    <div>
      <h2>프로필 페이지</h2>
      {userId === Number(id) ? (
        <>
          <h3>내 프로필</h3>
          <form action={signOutWithForm}>
            <button className='btn'>로그아웃</button>
          </form>
        </>
      ) : (
        <>
          <h3>다른 사람 프로필</h3>
        </>
      )}
    </div>
  )
}
