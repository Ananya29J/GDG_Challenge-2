"use client"

import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { Trophy, Ghost, Target, Brain, Sword, Zap, Ruler } from 'lucide-react'
import Link from 'next/link'

const GAMES = [
  { id: 'batting', name: 'Batting Blitz', icon: <Target className="w-6 h-6" />, color: 'text-primary-cyber', desc: 'Score as many 6s as you can.', players: '1.2k' },
  { id: 'souls', name: 'Soul Collector', icon: <Ghost className="w-6 h-6" />, color: 'text-purple-500', desc: 'Team battles for spirits.', players: '4.8k' },
  { id: 'trivia', name: 'Trivia Master', icon: <Brain className="w-6 h-6" />, color: 'text-blue-400', desc: 'IPL History Challenge.', players: '2.1k' },
  { id: 'rps', name: 'Cyber RPS', icon: <Sword className="w-6 h-6" />, color: 'text-green-500', desc: 'Strategic Combat RPS.', players: '850' },
  { id: 'bowling', name: 'Bowling Ace', icon: <Zap className="w-6 h-6" />, color: 'text-yellow-500', desc: 'Precision Accuracy.', players: '1.5k' },
  { id: 'six', name: 'Six Predictor', icon: <Ruler className="w-6 h-6" />, color: 'text-orange-500', desc: 'Guess the distance.', players: '3.2k' },
]

export function MultiplayerGames() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold uppercase tracking-widest text-sm">Mini Games</h3>
        <Link href="/games" className="text-[10px] uppercase font-bold text-primary-cyber hover:underline">View All</Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {GAMES.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id}>
            <HolographicCard className="p-4 group cursor-pointer border-white/5 hover:border-primary-cyber/50 transition-all" glowColor="rgba(0, 243, 255, 0.1)">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${game.color} group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-black uppercase tracking-tight text-sm">{game.name}</h4>
                  <p className="text-[10px] text-slate-500">{game.desc}</p>
                </div>
                <div className="text-[8px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded uppercase">
                  {game.players}
                </div>
              </div>
            </HolographicCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
