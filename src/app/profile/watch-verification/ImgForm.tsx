'use client'

import Image from 'next/image'
import { ChangeEvent, useActionState, useState } from 'react'
import {
  createCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
} from './actions'
import { CertificationStatus } from '@/types/api/common'

export default function ImgForm({
  status,
  certificationUrl,
}: {
  status: CertificationStatus
  certificationUrl: string | null
}) {
  const [currentImage, setCurrentImage] = useState(certificationUrl)

  const [createState, createAction] = useActionState(createCertificationAction, {
    message: '',
  })

  const [updateState, updateAction] = useActionState(updateCertificationAction, {
    message: '',
  })

  const [deleteState, deleteAction] = useActionState(deleteCertificationAction, {
    message: '',
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    setCurrentImage(URL.createObjectURL(file))
  }

  return (
    <div>
      {currentImage ? (
        <Image src={currentImage} alt='프로필 사진' width={100} height={100} />
      ) : (
        <div>이미지가 없습니다</div>
      )}

      <button
        className='btn'
        onClick={() => setCurrentImage(null)}
        type='button'
        disabled={!currentImage}
      >
        취소
      </button>

      <form action={status === 'NONE' ? createAction : updateAction}>
        <input type='file' name='file' accept='image/*' required onChange={handleImageChange} />
        <button className='btn btn-primary'>{status === 'NONE' ? '등록' : '수정'}</button>
      </form>

      {status === 'PENDING' && (
        <form action={deleteAction}>
          <button className='btn btn-secondary' type='submit'>
            삭제
          </button>
        </form>
      )}

      {(createState.message || updateState.message || deleteState.message) && (
        <p className='text-sm text-gray-500'>
          {createState.message || updateState.message || deleteState.message}
        </p>
      )}
    </div>
  )
}
