import HeaderWrapper from './HeaderWrapper'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderWrapper />
      {children}
    </>
  )
}
