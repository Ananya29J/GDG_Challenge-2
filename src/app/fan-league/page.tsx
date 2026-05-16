"use client"

import { FanPowerLeague } from '@/components/dashboard/FanPowerLeague'
import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { MapPin, Users, Zap } from 'lucide-react'

export default function FanLeaguePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-black italic uppercase text-secondary-cyber">Fan Power League</h1>
        <p className="text-slate-400 text-sm uppercase tracking-widest">Global Team Energy & Engagement War</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
           <FanPowerLeague />
        </div>
        
        <div className="lg:col-span-8 space-y-6">
           <HolographicCard className="p-8 h-[400px] flex items-center justify-center relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover">
              <div className="absolute inset-0 bg-slate-950/70" />
              <div className="relative z-10 text-center space-y-6">
                 <MapPin className="w-12 h-12 text-primary-cyber mx-auto animate-bounce" />
                 <h2 className="text-3xl font-black uppercase italic">Regional Influence Map</h2>
                 <p className="text-slate-400 max-w-md mx-auto">Your team is currently dominating in the South Asia region. Increase engagement to expand territory.</p>
                 <div className="flex justify-center gap-12">
                    <div>
                       <div className="text-2xl font-black text-primary-cyber">42%</div>
                       <div className="text-[10px] text-slate-500 uppercase">Coverage</div>
                    </div>
                    <div>
                       <div className="text-2xl font-black text-secondary-cyber">8.4M</div>
                       <div className="text-[10px] text-slate-500 uppercase">Total XP</div>
                    </div>
                 </div>
              </div>
           </HolographicCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HolographicCard className="p-6 border-white/5">
                 <h3 className="font-bold text-sm uppercase mb-4">Top Contributors</h3>
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800" />
                            <span className="font-bold">Player_{i}42</span>
                         </div>
                         <span className="text-primary-cyber font-mono font-bold">+12k XP</span>
                      </div>
                    ))}
                 </div>
              </HolographicCard>
              <HolographicCard className="p-6 border-white/5">
                 <h3 className="font-bold text-sm uppercase mb-4">Active Fan Missions</h3>
                 <div className="space-y-4">
                    <MissionItem label="Cheer Storm" status="84% Complete" />
                    <MissionItem label="Rival Defeat" status="12/20 Won" />
                 </div>
              </HolographicCard>
           </div>
        </div>
      </div>
    </div>
  )
}

function MissionItem({ label, status }: any) {
  return (
    <div className="space-y-1">
       <div className="flex justify-between text-xs font-bold uppercase">
          <span>{label}</span>
          <span className="text-primary-cyber">{status}</span>
       </div>
       <div className="h-1 w-full bg-slate-800 rounded-full">
          <div className="h-full bg-primary-cyber w-3/4" />
       </div>
    </div>
  )
}
