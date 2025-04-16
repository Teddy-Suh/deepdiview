'use client'

import Image from 'next/image'
import { ChangeEvent, useActionState, useState } from 'react'
import { deleteProfileImgAction, updateProfileImgAction } from './actions'

export default function ProfileImageForm({ profileImageUrl }: { profileImageUrl: string }) {
  const [currentImage, setCurrentImage] = useState(profileImageUrl)

  const [updateState, updateAction] = useActionState(updateProfileImgAction, {
    message: '',
  })

  const [deleteState, deleteAction] = useActionState(deleteProfileImgAction, {
    message: '',
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    setCurrentImage(URL.createObjectURL(file))
  }

  return (
    <div>
      <Image src={currentImage} alt='프로필 사진' width={100} height={100} />
      <form action={updateAction}>
        <input type='file' name='file' accept='image/*' required onChange={handleImageChange} />
        <button className='btn btn-primary'>수정</button>
      </form>
      <form action={deleteAction}>
        <button className='btn btn-secondary' type='submit'>
          삭제
        </button>
      </form>
      {(updateState.message || deleteState.message) && (
        <p className='text-sm text-gray-500'>{updateState.message || deleteState.message}</p>
      )}
    </div>
  )
}
