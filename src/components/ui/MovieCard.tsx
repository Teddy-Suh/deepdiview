import Image from 'next/image'

export default function MovieCard({ movie }) {
  return (
    <div
      className='card md:card-side before:rounded-inherit relative bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/70 md:h-96'
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
    >
      <figure className='z-10 shrink-0 px-3 pt-3 md:pt-5 md:pb-5 md:pl-5'>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt='포스터'
          className='rounded-xl'
          width={400}
          height={600}
        />
      </figure>
      <div className='card-body z-10'>
        <h2 className='card-title'>{movie.title}</h2>
        <p>{movie.overview}</p>
        <div className='card-actions justify-end'>
          <button className='btn btn-primary'>리뷰 작성하기</button>
        </div>
      </div>
    </div>
  )
}
