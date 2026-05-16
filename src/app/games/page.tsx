"use client"

import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { Target, Ghost, Brain, Sword, Zap, Ruler, Play } from 'lucide-react'
import Link from 'next/link'

const GAMES = [
  { id: 'batting', name: 'Batting Blitz', icon: Target, color: 'text-primary-cyber', bg: 'bg-primary-cyber/10', desc: 'Step into the futuristic pitch and score as many sixes as possible in 60 seconds.', players: '1.2k Active' },
  { id: 'souls', name: 'Soul Collector', icon: Ghost, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Team Purple vs Green. Collect wandering spirits and return them to base.', players: '4.8k Active' },
  { id: 'trivia', name: 'Trivia Master', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Test your knowledge of the IPL archives in this high-speed quiz arena.', players: '2.1k Active' },
  { id: 'rps', name: 'Cyber RPS', icon: Sword, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Strategic combat simulation using the ancient Rock-Paper-Scissors code.', players: '850 Active' },
  { id: 'bowling', name: 'Bowling Ace', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Master the art of precision and timing to shatter the cyber-stumps.', players: '1.5k Active' },
  { id: 'six', name: 'Six Predictor', icon: Ruler, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Use advanced ballistics estimation to predict the exact distance of massive hits.', players: '3.2k Active' },
]

export default function GamesHubPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-2">
         <h1 className="text-5xl font-black italic uppercase text-glow">Arcade Core</h1>
         <p className="text-slate-500 uppercase tracking-widest text-sm">Play Games • Earn XP • Support Team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GAMES.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <HolographicCard className="p-0 h-full flex flex-col group overflow-hidden border-white/5 hover:border-primary-cyber/30 transition-all" glowColor="rgba(0, 243, 255, 0.1)">
               <div className={`h-40 ${game.bg} flex items-center justify-center relative overflow-hidden`}>
                  <game.icon className={`w-16 h-16 ${game.color} group-hover:scale-110 transition-transform duration-500`} />
                  <div className="absolute bottom-2 right-2 text-[8px] font-bold text-white/40 uppercase tracking-widest">ARCADE_UNIT_{i+1}</div>
               </div>
               
               <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                     <div className="flex justify-between items-center">
                        <h3 className="font-black text-xl uppercase italic">{game.name}</h3>
                        <span className="text-[10px] font-bold text-primary-cyber uppercase">{game.players}</span>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed">{game.desc}</p>
                  </div>
                  
                  <Link href={`/games/${game.id}`}>
                     <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-black uppercase text-xs tracking-widest group-hover:bg-primary-cyber group-hover:text-black transition-all flex items-center justify-center gap-3">
                        <Play className="w-4 h-4 fill-current" /> Initialize Game
                     </button>
                  </Link>
               </div>
            </HolographicCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
