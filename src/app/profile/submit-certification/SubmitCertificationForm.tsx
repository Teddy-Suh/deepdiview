'use client'

import { ChangeEvent, useActionState, useEffect, useRef, useState } from 'react'
import {
  createCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
} from './actions'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { UserCertification } from '@/types/api/certification'
import CropImageModal from './CropImageModal'
import { CERTIFICATION_STATUS } from '@/constants/certification'
import CertificationItemWrapper from '@/components/ui/CertificationItemWrapper'
import GuideModal from './GuideModal'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { CERTIFICATION_CODES, CERTIFICATION_MESSAGES } from '@/constants/messages/certification'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

export default function SubmitCertificationForm({
  session,
  initialCertification,
}: {
  session: Session
  initialCertification: UserCertification
}) {
  const router = useRouter()
  const [certification, setCertification] = useState(initialCertification)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [, setImageFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createState, createAction, isCreatePending] = useActionState(
    createCertificationAction.bind(null, croppedImage),
    { code: '', certification: null }
  )

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateCertificationAction.bind(null, croppedImage),
    { code: '', certification: null }
  )

  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteCertificationAction, {
    code: '',
    certification: null,
  })

  // 등록
  useEffect(() => {
    if (createState.code === '') return

    if (createState.code === COMMON_CODES.SUCCESS && createState.certification) {
      setCertification(createState.certification)
      setCroppedImage(null)
      return
    }

    if (createState.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }
  }, [createState])

  // 수정
  useEffect(() => {
    if (updateState.code === '') return

    if (updateState.code === COMMON_CODES.SUCCESS && updateState.certification) {
      setCertification(updateState.certification)
      setCroppedImage(null)
      return
    }

    if (updateState.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (updateState.code === CERTIFICATION_CODES.ALREADY_APPROVED) {
      toast.error(CERTIFICATION_MESSAGES.ALREADY_APPROVED)
      router.replace(`/profile/${session.user?.userId}`)
      return
    }
  }, [router, session.user?.userId, updateState])

  // 삭제
  useEffect(() => {
    if (deleteState.code === '') return

    if (deleteState.code === COMMON_CODES.SUCCESS && deleteState.certification) {
      setCertification(deleteState.certification)
      setCroppedImage(null)
      return
    }

    if (deleteState.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (deleteState.code === CERTIFICATION_CODES.ALREADY_APPROVED) {
      toast.error(CERTIFICATION_MESSAGES.ALREADY_APPROVED)
      router.replace(`/profile/${session.user?.userId}`)
      return
    }
  }, [deleteState, router, session.user?.userId])

  // 자를 사진 추가
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setImageFile(file)
    setSelectedImageUrl(URL.createObjectURL(file))
    setIsCropOpen(true)
  }

  // 크롭 성공
  const handleCropDone = async (blob: Blob) => {
    setIsCropOpen(false)
    setCroppedImage(blob)
  }

  // 크롭 취소
  const handleCancelCrop = () => {
    setCroppedImage(null)
    setImageFile(null)
  }

  return (
    <div className='flex flex-1 flex-col'>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>시청 인증</h2>
        <button
          className='btn btn-circle btn-soft text-xl font-black'
          onClick={() => setIsGuideOpen((prev) => !prev)}
        >
          {isGuideOpen ? 'X' : '?'}
        </button>
      </GoBackHeader>

      <div className='container-wrapper flex flex-1 flex-col'>
        {/* PC 헤더 */}
        <div className='mt-4 mb-3 hidden items-center justify-between md:flex'>
          <div className='flex flex-1 items-center justify-between'>
            <h2 className='text-xl font-semibold'>시청 인증</h2>
            <button
              className='btn btn-circle btn-soft text-xl font-black'
              onClick={() => setIsGuideOpen((prev) => !prev)}
            >
              {isGuideOpen ? 'X' : '?'}
            </button>
          </div>
        </div>
        <div className='relative flex-1'>
          <CertificationItemWrapper certification={certification} croppedImage={croppedImage}>
            <div className='space-y-4'>
              {croppedImage ? (
                <>
                  {/* 자른 사진 있을 때: 업로드, 취소 */}
                  <form
                    action={
                      certification.status === CERTIFICATION_STATUS.NONE
                        ? createAction
                        : updateAction
                    }
                  >
                    <button
                      className='btn btn-primary w-full'
                      type='submit'
                      disabled={isCreatePending || isUpdatePending}
                    >
                      {isCreatePending || isUpdatePending ? (
                        <span className='loading loading-spinner' />
                      ) : (
                        '업로드'
                      )}
                    </button>
                  </form>
                  <button
                    className='btn btn-secondary btn-soft w-full'
                    type='button'
                    onClick={handleCancelCrop}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  {/* 자른 사진 없을 때: 선택, 삭제 */}
                  <button
                    className='btn btn-primary w-full'
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {certification.status === CERTIFICATION_STATUS.NONE
                      ? '인증샷 선택'
                      : '인증샷 수정'}
                  </button>
                  {certification.certificationDetails?.certificationUrl && (
                    <form action={deleteAction}>
                      <button
                        className='btn btn-secondary btn-soft w-full'
                        type='submit'
                        disabled={isDeletePending}
                      >
                        {isDeletePending ? <span className='loading loading-spinner' /> : '삭제'}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </CertificationItemWrapper>
          {/* 가이드 모달 */}
          {isGuideOpen && <GuideModal />}
        </div>
      </div>

      {/* 자를 이미지 input */}
      <input
        type='file'
        accept='image/*'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 이미지 크롭 모달 */}
      {isCropOpen && selectedImageUrl && (
        <CropImageModal
          imageUrl={selectedImageUrl}
          onClose={() => setIsCropOpen(false)}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  )
}
