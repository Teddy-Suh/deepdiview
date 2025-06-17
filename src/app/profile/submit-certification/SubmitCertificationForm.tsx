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

export default function SubmitCertificationForm({
  initialCertification,
}: {
  initialCertification: UserCertification
}) {
  const [certification, setCertification] = useState(initialCertification)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [, setImageFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createState, createAction, isCreatePending] = useActionState(
    createCertificationAction.bind(null, croppedImage),
    { message: '', certification: null }
  )

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateCertificationAction.bind(null, croppedImage),
    { message: '', certification: null }
  )

  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteCertificationAction, {
    message: '',
    certification: null,
  })

  // 수정
  useEffect(() => {
    if (updateState.certification) {
      setCertification(updateState.certification)
      setCroppedImage(null)
    }
  }, [updateState.certification])

  // 등록
  useEffect(() => {
    if (createState.certification) {
      setCertification(createState.certification)
      setCroppedImage(null)
    }
  }, [createState.certification])

  // 삭제
  useEffect(() => {
    if (deleteState.certification) {
      setCertification(deleteState.certification)
      setCroppedImage(null)
    }
  }, [deleteState.certification])

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
                      className='btn btn-primary w-full rounded-xl'
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
                    className='btn btn-secondary w-full rounded-2xl'
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
                    className='btn btn-primary w-full rounded-xl'
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
                        className='btn btn-secondary w-full rounded-2xl'
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

      {/* 에러 메시지 */}
      {/* TODO: 토스트 메세지 처리 */}
      {createState.message !== '' && <>{createState.message}</>}
      {updateState.message !== '' && <>{updateState.message}</>}
      {deleteState.message !== '' && <>{deleteState.message}</>}
    </div>
  )
}
