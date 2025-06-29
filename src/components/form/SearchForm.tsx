'use client'

import clsx from 'clsx'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (pathname === '/search') {
      const titleFromUrl = searchParams.get('title') ?? ''
      setQuery(titleFromUrl)
    } else {
      setQuery('')
    }
  }, [pathname, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const targetUrl = `/search?title=${encodeURIComponent(query)}`

    // 검색 페이지에서 쿼리만 바뀔때만 로딩 처리
    if (pathname === '/search') {
      startTransition(() => {
        router.push(targetUrl)
      })
    }
    // 다른 페이지에서 처음 검색 페이지 들어올땐 바로 이동 (rootLoading 붙음)
    else {
      router.push(targetUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <label
        className={clsx(
          'input focus-within:border-primary focus-within:bg-primary/15 w-full border-0 bg-gray-400/10 focus-within:outline-none',
          isPending && 'bg-gray-400/10!'
        )}
      >
        {isPending ? (
          <span className='loading loading-ring text-primary' />
        ) : (
          <Search className='h-[1em] opacity-50' />
        )}

        <input
          className='placeholder-gray-400'
          type='search'
          required
          placeholder='영화 제목을 입력해주세요.'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isPending}
        />
      </label>
    </form>
  )
}
