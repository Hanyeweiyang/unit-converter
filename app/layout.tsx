import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '电商工具集',
  description: '多功能单位转换器是一个为电商领域设计的实用工具集合，帮助用户轻松完成各种计算和转换任务。项目采用现代化前端技术栈，提供直观友好的用户界面和多语言支持。',
  generator: '电商工具集',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
