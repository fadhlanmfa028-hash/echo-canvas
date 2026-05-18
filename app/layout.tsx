import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EchoCanvas — AI Mental Health Art',
  description: 'Ubah emosimu menjadi mahakarya visual dengan AI. Lacak perjalanan emosionalmu, satu karya dalam satu waktu.',
  openGraph: {
    title: 'EchoCanvas',
    description: 'Ubah emosimu menjadi mahakarya visual',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
