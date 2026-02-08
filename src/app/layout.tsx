import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '傀儡師の思考地図',
  description: 'AIが蔵書から学び、考えた軌跡のネットワーク可視化',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
