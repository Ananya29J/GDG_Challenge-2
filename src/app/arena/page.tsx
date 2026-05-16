"use client"

import { PredictionArena } from '@/components/dashboard/PredictionArena'
import { motion } from 'framer-motion'
import { Radio, Users, Zap, HeartPulse } from 'lucide-react'
import { HolographicCard } from '@/components/ui/holographic-card'

export default function ArenaPage() {
  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <h1 className="text-4xl font-black italic uppercase text-glow">Match Center</h1>
          </div>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">CSK vs LSG • May 15, 2026 • Live from Stadium</p>
        </div>
        
        <div className="flex gap-6 items-center glass-morphism px-6 py-3 rounded-2xl border-white/5">
           <div className="text-center">
              <div className="text-xl font-black">1.2M</div>
              <div className="text-[8px] text-slate-500 uppercase">Fans Pulse</div>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="text-center">
              <div className="text-xl font-black text-primary-cyber">98%</div>
              <div className="text-[8px] text-slate-500 uppercase">Hype Level</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-8">
            <PredictionArena />
            
            <div className="mt-8 space-y-4">
               <h3 className="font-bold text-sm uppercase text-slate-500">Crowd Pulse</h3>
               <div className="h-48 glass-morphism rounded-3xl border-white/5 p-6 relative overflow-hidden flex items-center justify-center bg-slate-900/50">
                  <div className="text-center space-y-4">
                     <h4 className="text-3xl font-black uppercase italic italic text-glow">Current Situation</h4>
                     <p className="text-sm text-slate-400 font-bold">CSK requires 18 runs in 6 balls</p>
                     <div className="flex gap-4 justify-center">
                        <div className="text-center">
                           <div className="text-2xl font-black text-yellow-400">CSK</div>
                           <div className="text-[10px] text-slate-500 uppercase font-bold">92% WIN</div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                           <div className="text-2xl font-black text-blue-500">LSG</div>
                           <div className="text-[10px] text-slate-500 uppercase font-bold">8% WIN</div>
                        </div>
                     </div>
                  </div>
                  {/* Mock Emoji Storm */}
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: -200, opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute text-2xl"
                      style={{ left: `${i * 20}%` }}
                    >
                      {['🔥', '⚡', '🦁', '👑', '🏏'][i-1]}
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <HolographicCard className="p-6 border-primary-cyber/20">
               <h3 className="font-bold text-sm uppercase mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-cyber" /> Rewards Multiplier
               </h3>
               <div className="space-y-4">
                  <MultiplierItem label="First Prediction" value="1.2x" active />
                  <MultiplierItem label="Team Loyalty" value="1.5x" active />
                  <MultiplierItem label="Early Bird" value="2.0x" />
               </div>
            </HolographicCard>

            <HolographicCard className="p-6 border-white/5">
               <h3 className="font-bold text-sm uppercase mb-4">Live Commentary</h3>
               <div className="space-y-4 text-xs">
                  <CommentItem time="19.1" text="MS Dhoni enters the crease. The stadium is shaking!" />
                  <CommentItem time="19.0" text="Stoinis to bowl the final over. Tension is sky high." />
                  <CommentItem time="18.6" text="Abhishek Sharma swings hard! SIX!" />
               </div>
            </HolographicCard>
         </div>
      </div>
    </div>
  )
}

function MultiplierItem({ label, value, active }: any) {
  return (
    <div className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
      active ? 'bg-primary-cyber/10 border-primary-cyber/30 text-primary-cyber' : 'border-white/5 text-slate-500'
    }`}>
       <span className="text-[10px] font-bold uppercase">{label}</span>
       <span className="font-black text-lg italic">{value}</span>
    </div>
  )
}

function CommentItem({ time, text }: any) {
  return (
    <div className="flex gap-3">
       <span className="text-primary-cyber font-mono font-bold">{time}</span>
       <span className="text-slate-400">{text}</span>
    </div>
  )
}
