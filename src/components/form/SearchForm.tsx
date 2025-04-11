'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (pathname === '/search') {
      const titleFromUrl = searchParams.get('title') ?? ''
      setQuery(titleFromUrl)
    }
  }, [pathname, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?title=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className='input focus-within:border-primary focus-within:outline-none'>
        <Search className='h-[1em] opacity-50' />
        <input
          type='search'
          required
          placeholder='영화 제목을 입력해주세요.'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
    </form>
  )
}
