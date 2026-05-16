"use client"

import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { Zap, Users, ArrowUpRight } from 'lucide-react'

const FAN_POWER_TEAMS = [
  { team: 'RCB', energy: 98, activeFans: '1.2M', trend: 'up' },
  { team: 'CSK', energy: 95, activeFans: '1.1M', trend: 'up' },
  { team: 'MI', energy: 88, activeFans: '0.9M', trend: 'down' },
  { team: 'KKR', energy: 92, activeFans: '0.8M', trend: 'up' },
]

export function FanPowerLeague() {
  return (
    <HolographicCard className="p-6" glowColor="rgba(255, 0, 255, 0.2)">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-black text-xl uppercase italic text-secondary-cyber">Fan Power League</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Global Fan Engagement Status</p>
        </div>
        <div className="bg-secondary-cyber/20 p-2 rounded-lg border border-secondary-cyber/50">
          <Zap className="w-5 h-5 text-secondary-cyber" />
        </div>
      </div>

      <div className="space-y-6">
        {FAN_POWER_TEAMS.map((item, i) => (
          <div key={item.team} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">{item.team}</span>
                <span className="text-[10px] flex items-center gap-1 text-slate-500">
                  <Users className="w-3 h-3" /> {item.activeFans}
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-secondary-cyber">{item.energy}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-secondary-cyber to-primary-cyber"
                initial={{ width: 0 }}
                animate={{ width: `${item.energy}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 rounded-xl border border-secondary-cyber/30 text-secondary-cyber text-xs font-bold uppercase tracking-widest hover:bg-secondary-cyber/10 transition-all flex items-center justify-center gap-2">
        Contribute Energy <ArrowUpRight className="w-4 h-4" />
      </button>
    </HolographicCard>
  )
}
