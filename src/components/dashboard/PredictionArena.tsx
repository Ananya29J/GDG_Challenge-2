"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { NeonButton } from '@/components/ui/neon-button'
import { Timer, Radio, ChevronRight, ChevronLeft } from 'lucide-react'

const PREDICTIONS = [
  { id: 1, question: "Next Ball Outcome?", options: ["0-1 Run", "2-3 Runs", "4 Runs", "6 Runs", "Wicket"], xp: 200, time: 15 },
  { id: 2, question: "Will Abhishek Sharma score a 50?", options: ["Yes", "No"], xp: 500, time: 45 },
  { id: 3, question: "Total runs in next over?", options: ["< 8", "8-12", "13-18", "> 18"], xp: 350, time: 30 },
]

export function PredictionArena() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const current = PREDICTIONS[currentIdx]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="font-bold uppercase tracking-widest text-sm">Live Arena</h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-slate-500">
          <span className="flex items-center gap-1"><Radio className="w-3 h-3" /> SRH vs RCB</span>
          <span>Over 14.2</span>
        </div>
      </div>

      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 1.1, opacity: 0, rotateY: -90 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <HolographicCard className="p-8 border-primary-cyber/30 h-[300px] flex flex-col justify-between" glowColor="rgba(0, 243, 255, 0.4)">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 rounded bg-primary-cyber/10 text-primary-cyber text-[10px] font-black uppercase tracking-widest border border-primary-cyber/20">
                    +{current.xp} XP
                  </span>
                  <div className="flex items-center gap-1.5 text-primary-cyber">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono font-bold">{current.time}s</span>
                  </div>
                </div>
                <h4 className="text-2xl font-black uppercase italic leading-tight">{current.question}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt) => (
                  <button 
                    key={opt}
                    className="py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:border-primary-cyber hover:bg-primary-cyber/10 transition-all uppercase tracking-widest"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </HolographicCard>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={() => setCurrentIdx((prev) => (prev > 0 ? prev - 1 : PREDICTIONS.length - 1))}
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:border-primary-cyber opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setCurrentIdx((prev) => (prev < PREDICTIONS.length - 1 ? prev + 1 : 0))}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:border-primary-cyber opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
