"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}

export function HolographicCard({ children, className, glowColor, onClick }: HolographicCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative premium-glass overflow-hidden group rounded-[2rem]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 p-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 group-hover:from-primary-cyber/40 transition-all duration-500" />
      
      {/* Glow Effect */}
      <div 
        className="absolute -inset-20 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none blur-[100px]"
        style={{ background: glowColor || 'var(--color-primary-cyber)' }}
      />

      <div className="relative h-full w-full z-10">
        {children}
      </div>
      
      {/* Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-cyber/20 to-transparent -translate-y-full group-hover:animate-[scan_3s_linear_infinite]" />
    </motion.div>
  )
}
