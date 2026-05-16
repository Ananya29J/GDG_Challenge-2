"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { NeonButton } from '@/components/ui/neon-button'
import { Shield, Sword, Target, Zap, ArrowLeft, Info, Trophy, RefreshCw, ChevronRight, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserStore, TEAM_COLORS } from '@/lib/store'

const MOVES = [
  { id: 'rock', name: 'CORE STRIKE', icon: <Target className="w-12 h-12" />, beats: 'scissors', color: 'text-red-500', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' },
  { id: 'paper', name: 'ENERGY SHIELD', icon: <Shield className="w-12 h-12" />, beats: 'rock', color: 'text-blue-500', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
  { id: 'scissors', name: 'DATA BLADE', icon: <Sword className="w-12 h-12" />, beats: 'paper', color: 'text-green-500', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]' },
]

export default function CyberRPS() {
  const [userMove, setUserMove] = useState<any>(null)
  const [aiMove, setAiMove] = useState<any>(null)
  const [result, setResult] = useState<string | null>(null)
  const [score, setScore] = useState({ user: 0, ai: 0 })
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [showHowTo, setShowHowTo] = useState(false)
  const { addXP, team } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (score.user >= 5 || score.ai >= 5) {
      setTimeout(() => setGameState('gameover'), 1000)
      if (score.user >= 5) addXP(500)
    }
  }, [score, addXP])

  const play = (move: any) => {
    if (userMove || gameState !== 'playing') return
    const ai = MOVES[Math.floor(Math.random() * MOVES.length)]
    setUserMove(move)
    setAiMove(ai)

    if (move.id === ai.id) {
      setResult('DRAW')
    } else if (move.beats === ai.id) {
      setResult('WIN!')
      setScore(s => ({ ...s, user: s.user + 1 }))
    } else {
      setResult('LOST')
      setScore(s => ({ ...s, ai: s.ai + 1 }))
    }

    setTimeout(() => {
      setUserMove(null)
      setAiMove(null)
      setResult(null)
    }, 1500)
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-outfit p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_70%)]" />
         <div className="w-full h-full grid grid-cols-8 grid-rows-8 border-white/5 border-[0.5px]">
            {Array.from({length: 64}).map((_, i) => <div key={i} className="border-white/5 border-[0.5px]" />)}
         </div>
      </div>

      {/* HUD */}
      <div className="absolute top-8 left-8 z-20 flex gap-4 pointer-events-auto">
        <button onClick={() => router.push('/dashboard')} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setShowHowTo(true)} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all text-primary-cyber">
          <Info className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center space-y-12">
            <div className="space-y-4">
               <Zap className="w-16 h-16 text-primary-cyber mx-auto animate-pulse shadow-[0_0_50px_rgba(0,243,255,0.4)]" />
               <h1 className="text-6xl font-black italic uppercase text-glow-premium tracking-tighter leading-none">CYBER<br/>RPS</h1>
               <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Neural Combat Simulation</p>
            </div>
            <NeonButton size="lg" className="h-16 px-10 text-xl" onClick={() => setGameState('playing')}>INITIATE WAR</NeonButton>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 w-full max-w-5xl flex flex-col items-stretch gap-12">
            {/* Scoreboard */}
            <div className="flex justify-between items-center px-12">
              <TeamScore label={team || "YOU"} score={score.user} color={TEAM_COLORS[team || 'CSK']} side="left" />
              <div className="flex flex-col items-center gap-4 flex-1 max-w-sm">
                 <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] italic">Combat Progress</div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div className="h-full bg-primary-cyber shadow-[0_0_15px_#00f3ff]" animate={{ width: `${(score.user / 5) * 100}%` }} />
                 </div>
              </div>
              <TeamScore label="MAINFRAME" score={score.ai} color="#fff" side="right" />
            </div>

            {/* Arena */}
            <div className="grid grid-cols-3 gap-12 items-center h-64">
              <div className="flex justify-center">
                 <AnimatePresence>
                   {userMove ? (
                     <motion.div initial={{ x: -100, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1.5 }} className={cn(userMove.color, userMove.glow, "p-8 rounded-[2rem] premium-glass")}>
                       {userMove.icon}
                     </motion.div>
                   ) : (
                     <motion.div initial={{ opacity: 0.2 }} animate={{ opacity: 0.1 }} className="text-white font-black text-2xl italic tracking-widest">AWAITING INPUT</motion.div>
                   )}
                 </AnimatePresence>
              </div>
              
              <div className="flex justify-center h-full items-center">
                 <AnimatePresence mode="wait">
                   {result && (
                     <motion.div key={result} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 2, opacity: 0 }} className="text-8xl font-black italic uppercase text-glow-premium">
                       {result}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="flex justify-center">
                 <AnimatePresence>
                   {aiMove ? (
                     <motion.div initial={{ x: 100, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1.5 }} className={cn(aiMove.color, aiMove.glow, "p-8 rounded-[2rem] premium-glass")}>
                       {aiMove.icon}
                     </motion.div>
                   ) : (
                     <motion.div initial={{ opacity: 0.2 }} animate={{ opacity: 0.1 }} className="text-white font-black text-2xl italic tracking-widest">READY</motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-6">
              {MOVES.map((move) => (
                <motion.button 
                  key={move.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => play(move)}
                  disabled={userMove}
                  className="group relative"
                >
                  <HolographicCard className="p-10 text-center border-white/5 group-hover:border-primary-cyber/40 transition-all overflow-hidden">
                     <div className={cn("mx-auto mb-6 group-hover:scale-125 transition-all duration-500", move.color)}>
                       {move.icon}
                     </div>
                     <h3 className="font-black text-xs uppercase tracking-[0.3em]">{move.name}</h3>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
                  </HolographicCard>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center space-y-12">
            <Trophy className={cn("w-24 h-24 mx-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]", score.user >= 5 ? 'text-yellow-500' : 'text-slate-800')} />
            <div className="space-y-4">
              <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">{score.user >= 5 ? 'DOMINATED' : 'OVERLOADED'}</h2>
              <div className="text-3xl font-black text-primary-cyber italic">{score.user} — {score.ai}</div>
            </div>
            <div className="flex gap-6 justify-center pt-8">
               <NeonButton className="h-14 px-10 text-base rounded-2xl" variant="outline" onClick={() => { setScore({user:0, ai:0}); setGameState('playing') }}>NEW CONFLICT</NeonButton>
               <NeonButton className="h-14 px-10 text-base rounded-2xl" onClick={() => router.push('/dashboard')}>DASHBOARD</NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Hierarchy Diagram */}
      <AnimatePresence>
        {showHowTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8">
             <HolographicCard className="max-w-3xl w-full p-12 space-y-12 border-primary-cyber/20">
                <div className="text-center space-y-2">
                   <h3 className="text-4xl font-black uppercase italic text-primary-cyber tracking-tighter">Combat Logic</h3>
                   <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">The Neural Hierarchy Code</p>
                </div>

                <div className="flex justify-between items-center relative py-8 px-8">
                   <VisualNode icon={<Target className="w-8 h-8" />} label="Strike" color="text-red-500" beats="Blade" />
                   <ChevronRight className="w-8 h-8 text-slate-800" />
                   <VisualNode icon={<Sword className="w-8 h-8" />} label="Blade" color="text-green-500" beats="Shield" />
                   <ChevronRight className="w-8 h-8 text-slate-800" />
                   <VisualNode icon={<Shield className="w-8 h-8" />} label="Shield" color="text-blue-500" beats="Strike" />
                   
                   {/* Loop Back Connection Visual */}
                   <div className="absolute inset-x-0 bottom-0 flex justify-center">
                      <div className="w-[75%] h-8 border-b border-x border-white/10 rounded-b-[3rem] relative">
                         <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 bg-black px-4 text-[10px] text-white/20 font-black uppercase tracking-widest italic italic">Infinite Combat Loop</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12 text-sm border-t border-white/5 pt-12">
                   <div className="space-y-4">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <Zap className="w-6 h-6" /> Objective
                      </div>
                      <p className="text-slate-500 leading-relaxed text-base">Neutralize the Mainframe. Each success yields <span className="text-white font-bold italic">1 PT</span>. First to <span className="text-white font-bold italic">5 PTS</span> secures the XP bounty.</p>
                   </div>
                   <div className="space-y-4">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <RefreshCw className="w-6 h-6" /> Dynamic AI
                      </div>
                      <p className="text-slate-500 leading-relaxed text-base">The Mainframe calculates your probability patterns. Vary your nodes to maintain tactical dominance.</p>
                   </div>
                </div>

                <NeonButton className="w-full h-20 rounded-3xl text-2xl font-black italic uppercase" onClick={() => setShowHowTo(false)}>START SYNC</NeonButton>
             </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TeamScore({ label, score, color, side }: any) {
  return (
    <div className={cn("flex flex-col items-center gap-4 transition-all duration-700", side === 'left' ? "items-start" : "items-end")}>
       <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">{label}</div>
       <div className="text-8xl font-black italic leading-none" style={{ color }}>{score}</div>
    </div>
  )
}

function VisualNode({ icon, label, color, beats }: any) {
  return (
    <div className="flex flex-col items-center gap-6 group">
       <div className={cn("p-10 rounded-[2.5rem] premium-glass transition-all duration-500 group-hover:scale-110", color)}>
          {icon}
       </div>
       <div className="text-center space-y-1">
          <div className={cn("font-black uppercase italic tracking-widest text-base", color)}>{label}</div>
          <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest italic italic italic">Beats {beats}</div>
       </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
