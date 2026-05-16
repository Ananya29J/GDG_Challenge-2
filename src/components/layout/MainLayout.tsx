"use client"

import { Sidebar } from './Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore, TEAM_COLORS } from '@/lib/store'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { team } = useUserStore()

  useEffect(() => {
    if (team) {
      const primary = TEAM_COLORS[team] || '#00f3ff'
      document.documentElement.style.setProperty('--team-primary', primary)
      // Darker secondary for premium feel
      document.documentElement.style.setProperty('--team-secondary', '#ff00ff')
    }
  }, [team])
  
  const isOnboarding = pathname === '/'
  const isGame = pathname.startsWith('/games/')

  if (isOnboarding || isGame) return <div className="bg-black min-h-screen">{children}</div>

  return (
    <div className="flex min-h-screen bg-[#03040a] text-white overflow-x-hidden selection:bg-primary-cyber selection:text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar stadium-grid">
        <header className="p-8 sticky top-0 z-40 bg-[#03040a]/80 backdrop-blur-2xl border-b border-white/5">
          <DashboardHeader />
        </header>
        
        <main className="p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Premium Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-cyber/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-cyber/5 rounded-full blur-[120px] animate-pulse" />
      </div>
    </div>
  )
}
