import React, { ReactNode } from 'react'

export default function ReviewFormSection({ children }: { children?: ReactNode }) {
  return (
    <section className='container-wrapper flex flex-1 flex-col md:px-48 lg:px-56'>
      {children}
    </section>
  )
}
