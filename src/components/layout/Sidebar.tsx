"use client"

import { motion } from 'framer-motion'
import { LayoutDashboard, Trophy, Zap, Radio, Gamepad2, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Trophy, label: 'Standings', href: '/standings' },
  { icon: Zap, label: 'Fan League', href: '/fan-league' },
  { icon: Radio, label: 'Live Arena', href: '/arena' },
  { icon: Gamepad2, label: 'Games Hub', href: '/games' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-20 lg:w-64 h-screen glass-morphism border-r border-white/5 sticky top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary-cyber flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)]">
          <Zap className="w-6 h-6 text-black" />
        </div>
        <span className="hidden lg:block font-black text-xl italic text-glow tracking-tighter">FANVERSE</span>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary-cyber/10 border border-primary-cyber/30 text-primary-cyber" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]")} />
                <span className="hidden lg:block font-bold text-sm tracking-wide uppercase">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill" 
                    className="absolute left-0 w-1 h-6 bg-primary-cyber rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block font-bold text-sm uppercase">Settings</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="hidden lg:block font-bold text-sm uppercase">Logout</span>
        </button>
      </div>
    </aside>
  )
}
