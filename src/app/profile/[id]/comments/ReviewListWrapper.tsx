import ReviewList from '@/components/ui/ReviewList'
import { getUserComments } from '@/lib/api/user'
import { Session } from 'next-auth'

export default async function ReviewListWrapper({ session, id }: { session: Session; id: string }) {
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
    <ReviewList
      session={session}
      initialReviews={reviewWithCommentsList}
      initialLast={userComments.last}
      userId={id}
      withComment
    />
  )
}
