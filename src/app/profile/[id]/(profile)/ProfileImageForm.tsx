'use client'

import Image from 'next/image'
import { ChangeEvent, useActionState, useEffect, useRef, useState } from 'react'
import { deleteProfileImgAction, updateProfileImgAction } from './actions'
import { ArrowUpFromLine, Camera, Trash2, X } from 'lucide-react'
import CropImageModal from './CropImageModal'
import { BASE_PROFILE_IMAGES } from '@/constants/image'

export default function ProfileImageForm({
  profileImageUrl,
  readOnly,
  isEdit,
}: {
  profileImageUrl: string
  readOnly: boolean
  isEdit: boolean
}) {
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [, setImageFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteProfileImgAction, {
    message: '',
  })

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateProfileImgAction.bind(null, croppedImage),
    {
      success: null,
      message: '',
    }
  )

  // 업로드 성공
  useEffect(() => {
    if (updateState.success) {
      setCroppedImage(null)
    }
    updateState.success = null
  }, [updateState, updateState.success])

  // 밖에서 isEdit으로 편집 모드 종료
  useEffect(() => {
    if (isEdit === false) {
      setSelectedImageUrl(profileImageUrl)
      setCroppedImage(null)
    }
  }, [isEdit, profileImageUrl])

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

  if (readOnly)
    return (
      <Image
        src={profileImageUrl}
        alt='프로필 사진'
        width={100}
        height={100}
        className='rounded-full'
      />
    )

  return (
    <>
      <div className='relative'>
        <Image
          src={croppedImage ? URL.createObjectURL(croppedImage) : profileImageUrl}
          alt='프로필 사진'
          width={100}
          height={100}
          className='rounded-full'
        />

        {isEdit && (
          <>
            {/* 파일 선택 버튼 오른쪽 하단*/}
            {!croppedImage && (
              <button
                className='profile-btn right-0 bottom-0'
                type='button'
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className='stroke-2' />
              </button>
            )}

            {/* 기존 사진 있으면 오른쪽 상단 삭제 버튼 */}
            {!croppedImage && profileImageUrl !== BASE_PROFILE_IMAGES && (
              <form action={deleteAction}>
                <button
                  className='profile-btn bg-error top-0 right-0'
                  type='submit'
                  disabled={isDeletePending}
                >
                  {isDeletePending ? (
                    <span className='loading loading-spinner' />
                  ) : (
                    <Trash2 className='stroke-2' />
                  )}
                </button>
              </form>
            )}

            {/* 자른 사진 있을 때 */}
            {croppedImage && (
              <>
                {/* 자른 사진 취소 버튼*/}
                <button
                  className='profile-btn bg-error top-0 right-0'
                  type='button'
                  onClick={handleCancelCrop}
                >
                  <X className='stroke-3' />
                </button>
                {/* 자른 사진 업로드 버튼*/}
                <form action={updateAction}>
                  <button
                    className='profile-btn right-0 bottom-0'
                    type='submit'
                    disabled={isUpdatePending}
                  >
                    {isUpdatePending ? (
                      <span className='loading loading-spinner' />
                    ) : (
                      <ArrowUpFromLine className='stroke-2' />
                    )}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>

      <input
        type='file'
        accept='image/*'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {isCropOpen && selectedImageUrl && (
        <CropImageModal
          imageUrl={selectedImageUrl}
          onClose={() => setIsCropOpen(false)}
          onCropDone={handleCropDone}
        />
      )}

      {deleteState.message !== '' && <>{deleteState.message}</>}
      {updateState.message !== '' && <>{updateState.message}</>}
    </>
  )
}
