'use client'

import { useActionState, useEffect } from 'react'
import GoBackHeader from '../layout/MobileHeader/GoBackHeader'
import Rating from '../ui/Rating'
import { useRouter } from 'next/navigation'
import CertifiedBadge from '../ui/CertifiedBadge'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { REVIEW_CODES, REVIEW_MESSAGES } from '@/constants/messages/review'
import { useForm } from 'react-hook-form'
import { baseReviewClientInput, baseReviewClientSchema } from '@/schemas/common/baseReview'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ReviewForm({
  action,
  movieTitle,
  initialValue,
  certified,
}: {
  action: (
    state: { code: string; resReviewId: string },
    formData: FormData
  ) => Promise<{ code: string; resReviewId: string }>
  movieTitle: string
  initialValue?: { title: string; content: string; rating: number }
  certified: boolean
}) {
  const isEdit = !!initialValue
  const [state, formAction, isPending] = useActionState(action, {
    code: '',
    resReviewId: '',
  })
  const router = useRouter()

  const {
    register,
    watch,
    reset,
    formState: { isValid },
  } = useForm<baseReviewClientInput>({
    resolver: zodResolver(baseReviewClientSchema),
    mode: 'onChange',
    defaultValues: {
      rating: initialValue?.rating.toString(),
      title: initialValue?.title,
      content: initialValue?.content,
    },
  })

  const content = watch('content') ?? ''
  const contentLength = content.length
  watch(['rating', 'title'])

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.SUCCESS) {
      return router.replace(`/reviews/${state.resReviewId}`)
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      reset(watch())
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (state.code === REVIEW_CODES.ALREADY_COMMITTED_REVIEW) {
      toast.error(REVIEW_MESSAGES.ALREADY_COMMITTED_REVIEW)
      return router.push('/')
    }
  }, [reset, router, state, watch])

  return (
    <form action={formAction} className='flex flex-1 flex-col'>
      <GoBackHeader>
        <div className='flex flex-1 items-center gap-2'>
          <h2 className='line-clamp-1 rounded-xl text-xl font-semibold'>{movieTitle}</h2>
          {certified && <CertifiedBadge />}
        </div>
        <button className='btn btn-primary' type='submit' disabled={isPending || !isValid}>
          {isPending ? <span className='loading loading-ring' /> : <>{isEdit ? '수정' : '작성'}</>}
        </button>
      </GoBackHeader>
      <div className='mt-4 mb-3 hidden items-center justify-between md:flex'>
        <div className='flex flex-1 items-center gap-2'>
          <h2 className='text-xl font-semibold'>{movieTitle}</h2>
          {certified && <CertifiedBadge />}
        </div>
        <button className='btn btn-primary' type='submit' disabled={isPending || !isValid}>
          {isPending ? <span className='loading loading-ring' /> : <>{isEdit ? '수정' : '작성'}</>}
        </button>
      </div>
      <div className='bg-base-300 flex flex-1 flex-col rounded-2xl p-5 md:p-7'>
        <div className='mb-5 md:mb-7'>
          <Rating rating={initialValue?.rating} register={register('rating')} />
        </div>
        <label className='mb-3 flex items-center justify-between gap-4 md:mb-4'>
          <input
            {...register('title')}
            className='flex-1 border-0 text-lg font-bold focus:outline-0'
            placeholder='제목을 입력해 주세요'
            type='text'
            maxLength={60}
          />
        </label>
        <textarea
          {...register('content')}
          className='mb-3 flex-1 resize-none border-0 text-lg focus:outline-0 md:mb-4'
          placeholder={`${movieTitle}에 대한 생각을 자유롭게 공유해 주세요!`}
          maxLength={10000}
        />
        <span className='text-end tracking-tighter text-gray-400'>{contentLength} / 10000</span>
      </div>
    </form>
  )
}
