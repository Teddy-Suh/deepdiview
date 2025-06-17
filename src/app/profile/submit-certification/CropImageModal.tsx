/* eslint-disable @next/next/no-img-element */
'use client'

import CropImageModalWrapper from '@/components/ui/CropImageModalWrapper'
import { useRef, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function CropImageModal({
  imageUrl,
  onClose,
  onCropDone,
}: {
  imageUrl: string
  onClose: () => void
  onCropDone: (blob: Blob) => void
}) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const initialCrop: Crop = {
      unit: 'px',
      x: 0,
      y: 0,
      width,
      height,
    }
    setCrop(initialCrop)
  }

  const onCrop = () => {
    const image = imgRef.current
    if (!completedCrop || !image) return

    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No 2d context')

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    canvas.toBlob((blob) => {
      if (blob) onCropDone(blob)
    }, 'image/jpeg')
  }

  return (
    <CropImageModalWrapper onClose={onClose} onCrop={onCrop}>
      <div className='flex flex-1 items-center justify-center'>
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          keepSelection={true}
        >
          <img
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
            ref={imgRef}
            src={imageUrl}
            alt='자를 이미지'
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>
    </CropImageModalWrapper>
  )
}
