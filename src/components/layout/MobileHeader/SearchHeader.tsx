'use client'

import SearchForm from '@/components/form/SearchForm'

export default function SearchHeader() {
  return (
    <>
      <div className='container-wrapper bg-base-100 fixed right-0 left-0 z-50 flex h-16 items-center justify-center border-b-1 border-b-gray-300 md:hidden dark:border-b-gray-700'>
        <SearchForm />
      </div>
      <div className='pb-16 md:hidden' />
    </>
  )
}
