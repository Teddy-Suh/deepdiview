import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='dark:bg-base-300 hidden border-t-1 border-t-gray-300 bg-black/5 p-4 text-center text-sm text-gray-500 md:block dark:border-t-gray-800'>
      <div className='container-wrapper'>
        <p>© 2025 DeepDiview. All Rights Reserved.</p>
        <div className='mt-2 space-x-4'>
          <Link
            href='https://github.com/Teddy-Suh'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline'
          >
            FE Dev GitHub
          </Link>
          <Link
            href='https://github.com/Hue-Jo'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline'
          >
            BE Dev GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
