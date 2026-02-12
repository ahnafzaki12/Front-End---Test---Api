import React from 'react'
import Navbar from './Navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto md:p-6 md:ml-14 md:mr-16 md:max-w-none md:mx-0">
        {children}
      </main>
    </div>
  )
}