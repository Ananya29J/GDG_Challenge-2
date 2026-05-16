"use client"

import { motion } from 'framer-motion'
import { useUserStore } from '@/lib/store'
import { Trophy, Zap, Flame, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardHeader() {
  const { team, xp, level, streak } = useUserStore()

  return (
    <header className="glass-morphism rounded-3xl p-4 flex items-center justify-between border-primary-cyber/20">
      <div className="flex items-center gap-4">
        {/* Team Badge */}
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2",
          team === 'CSK' ? "bg-yellow-500/20 border-yellow-500 shadow-yellow-500/50" :
          team === 'MI' ? "bg-blue-500/20 border-blue-500 shadow-blue-500/50" :
          team === 'RCB' ? "bg-red-500/20 border-red-500 shadow-red-500/50" :
          team === 'KKR' ? "bg-purple-500/20 border-purple-500 shadow-purple-500/50" :
          team === 'SRH' ? "bg-orange-500/20 border-orange-500 shadow-orange-500/50" :
          team === 'RR' ? "bg-pink-500/20 border-pink-500 shadow-pink-500/50" :
          team === 'GT' ? "bg-slate-800/20 border-slate-400 shadow-slate-400/50" :
          team === 'LSG' ? "bg-cyan-500/20 border-cyan-500 shadow-cyan-500/50" :
          team === 'DC' ? "bg-blue-700/20 border-blue-700 shadow-blue-700/50" :
          "bg-red-600/20 border-red-600 shadow-red-600/50"
        )}>
          {getTeamLogo(team || '')}
        </div>
        
        <div>
          <h2 className="font-black text-xl tracking-tighter uppercase italic">{team} COMMANDER</h2>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary-cyber"
                initial={{ width: 0 }}
                animate={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-primary-cyber uppercase">Lvl {level}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <StatBadge icon={<Flame className="w-4 h-4 text-orange-500" />} label="Streak" value={streak} color="text-orange-500" />
        <StatBadge icon={<Zap className="w-4 h-4 text-primary-cyber" />} label="XP" value={xp} color="text-primary-cyber" />
        <StatBadge icon={<Trophy className="w-4 h-4 text-yellow-500" />} label="Rank" value="#1,402" color="text-yellow-500" />
        
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary-cyber transition-all">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </header>
  )
}

function StatBadge({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={cn("font-black text-sm", color)}>{value}</span>
      </div>
      <span className="text-[8px] uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  )
}
function getTeamLogo(id: string) {
  const logos: Record<string, string> = {
    CSK: '🦁', MI: '🌪️', RCB: '👑', KKR: '⚔️', SRH: '🦅', RR: '👑', GT: '⚡', LSG: '🛰️', DC: '🐯', PBKS: '🦁'
  }
  return logos[id] || '🏏'
}
