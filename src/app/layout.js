import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Voucher Management App',
  description: 'Build by Jitendra Bhadoriya ',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}