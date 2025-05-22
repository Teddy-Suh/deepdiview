'use client'

import { useActionState, useEffect } from 'react'
import GoBackHeader from '../layout/MobileHeader/GoBackHeader'
import Rating from '../ui/Rating'
import { useRouter } from 'next/navigation'
import CertifiedBadge from '../ui/CertifiedBadge'

export default function ReviewForm({
  action,
  movieTitle,
  initialValue,
  certified,
}: {
  action: (
    state: { message: string; responseReviewId: string },
    formData: FormData
  ) => Promise<{ message: string; responseReviewId: string }>
  movieTitle: string
  initialValue?: { title: string; content: string; rating: number }
  certified: boolean
}) {
  const isEdit = !!initialValue
  const [state, formAction, isPending] = useActionState(action, {
    message: '',
    responseReviewId: '',
  })
  const router = useRouter()

  useEffect(() => {
    if (state.message === 'success') {
      router.push(`/reviews/${state.responseReviewId}`)
    }
  }, [router, state])

  return (
    <form action={formAction} className='flex flex-1 flex-col'>
      <GoBackHeader>
        <div className='flex flex-1 items-center gap-2'>
          <h2 className='line-clamp-1 rounded-xl text-xl font-semibold'>{movieTitle}</h2>
          {certified && <CertifiedBadge />}
        </div>
        <button className='btn btn-primary rounded-xl' type='submit' disabled={isPending}>
          {isPending ? <span className='loading loading-ring' /> : <>{isEdit ? '수정' : '작성'}</>}
        </button>
      </GoBackHeader>
      <div className='mt-4 mb-3 hidden items-center justify-between md:flex'>
        <div className='flex flex-1 items-center gap-2'>
          <h2 className='text-xl font-semibold'>{movieTitle}</h2>
          {certified && <CertifiedBadge />}
        </div>
        <button className='btn btn-primary rounded-xl' type='submit' disabled={isPending}>
          {isPending ? <span className='loading loading-ring' /> : <>{isEdit ? '수정' : '작성'}</>}
        </button>
      </div>
      {state.message !== 'success' && <p>{state.message}</p>}
      <div className='bg-base-300 flex flex-1 flex-col rounded-2xl p-5 md:p-7'>
        <div className='mb-5 md:mb-7'>
          <Rating rating={initialValue?.rating} />
        </div>
        <input
          className='mb-3 border-0 text-lg font-bold focus:outline-0 md:mb-4'
          placeholder='제목을 입력해 주세요'
          type='text'
          name='title'
          defaultValue={initialValue?.title}
          required
        />
        <textarea
          className='flex-1 resize-none border-0 text-lg focus:outline-0'
          placeholder={`${movieTitle}에 대한 생각을 자유롭게 공유해 주세요!`}
          name='content'
          defaultValue={initialValue?.content}
          required
        />
      </div>
    </form>
  )
}
