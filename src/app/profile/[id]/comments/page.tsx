export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewList from '@/components/ui/ReviewList'
import { getUserComments } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export default async function UserCommentsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const userComments = await getUserComments(session.accessToken, id, {
    page: 0,
    size: 12,
  })

  // reviewList 재사용 하려고 재가공
  // review필드에 감싸져 있던 리뷰를 풀고
  // 댓글을 comment에 담음
  const reviewWithCommentsList = userComments.content.map((item) => {
    const { review, ...commentFields } = item

    const comment = {
      ...commentFields,
    }

    const reviewWithComment = {
      ...review,
      comment,
    }

    return reviewWithComment
  })

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>댓글</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>댓글</h2>
        </div>
        <ReviewList
          session={session}
          initialReviews={reviewWithCommentsList}
          initialLast={userComments.last}
          userId={id}
          withComment
        />
      </div>
    </>
  )
}
