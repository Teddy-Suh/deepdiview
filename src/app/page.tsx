import MovieCard from '@/components/ui/MovieCard'

export default function HomePage() {
  const movie = {
    adult: false,
    backdrop_path: '/rhc8Mtuo3Kh8CndnlmTNMF8o9pU.jpg',
    genre_ids: [28, 53],
    id: 1005331,
    original_language: 'en',
    original_title: 'Carry-On',
    overview:
      '크리스마스이브, 항공기에 위험한 물건을 실으라는 강요를 받은 공항 보안 요원. 이 위협에서 벗어나려면, 의문의 여행자보다 한 수 앞서 움직여야 한다.',
    popularity: 1202.654,
    poster_path: '/moQ4z3yKFwd7CuNqrLINMl1pdp.jpg',
    release_date: '2024-12-05',
    title: '캐리온',
    video: false,
    vote_average: 7,
    vote_count: 1515,
  }

  return (
    <>
      <section>
        <h2>인기 영화 순위</h2>
      </section>
      <section>
        <h2>이 주의 영화</h2>
        <MovieCard movie={movie} />
      </section>
      <section>
        <h2>최신 리뷰</h2>
      </section>
    </>
  )
}
