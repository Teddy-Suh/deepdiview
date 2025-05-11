import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-base-200 hidden border-t border-t-gray-700 p-4 text-center text-sm text-gray-500 md:block'>
      <p>© 2025 Deepdiview. All Rights Reserved.</p>
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
    </footer>
  )
}
