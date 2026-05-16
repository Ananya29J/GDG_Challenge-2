"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { NeonButton } from '@/components/ui/neon-button'
import { Timer, Trophy, Brain, ArrowLeft, CheckCircle2, XCircle, Zap, Shield, ChevronRight } from 'lucide-react'
import { useUserStore, TEAM_COLORS } from '@/lib/store'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 1,
    q: "Who has the most centuries in IPL history?",
    options: ["Virat Kohli", "Chris Gayle", "Jos Buttler", "KL Rahul"],
    a: 0
  },
  {
    id: 2,
    q: "Which team won the first ever IPL in 2008?",
    options: ["CSK", "RR", "MI", "KKR"],
    a: 1
  },
  {
    id: 3,
    q: "Who is the highest wicket-taker in IPL history?",
    options: ["Lasith Malinga", "Yuzvendra Chahal", "Dwayne Bravo", "Amit Mishra"],
    a: 1
  },
  {
    id: 4,
    q: "Who is known as the 'Universe Boss' in IPL?",
    options: ["AB de Villiers", "Chris Gayle", "Andre Russell", "MS Dhoni"],
    a: 1
  },
  {
      id: 5,
      q: "Which player has the most 'Player of the Match' awards?",
      options: ["Chris Gayle", "AB de Villiers", "Rohit Sharma", "David Warner"],
      a: 1
  },
  {
      id: 6,
      q: "Which team has won the most IPL titles?",
      options: ["CSK", "MI", "KKR", "Both CSK & MI"],
      a: 3
  }
]

export default function TriviaMaster() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [history, setHistory] = useState<any[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  
  const { addXP, team } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showCorrect) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && gameState === 'playing' && !showCorrect) {
      handleAnswer(-1)
    }
  }, [timeLeft, gameState, showCorrect])

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return
    
    const question = QUESTIONS[currentIdx]
    const isCorrect = idx === question.a
    setSelectedIdx(idx)
    setShowCorrect(true)
    
    if (isCorrect) {
      setScore(s => s + 100)
      addXP(50)
    }

    setHistory(prev => [...prev, { 
      q: question.q, 
      userAns: idx === -1 ? 'TIMEOUT' : question.options[idx], 
      correctAns: question.options[question.a],
      isCorrect 
    }])

    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1)
        setTimeLeft(15)
        setSelectedIdx(null)
        setShowCorrect(false)
      } else {
        setGameState('gameover')
      }
    }, 2000)
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-outfit p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_70%)]" />
         <div className="w-full h-full grid grid-cols-12 grid-rows-12">
            {Array.from({length: 144}).map((_, i) => <div key={i} className="border-white/5 border-[0.5px]" />)}
         </div>
      </div>

      {/* HUD */}
      <div className="absolute top-8 left-8 z-20 flex gap-4">
        <button onClick={() => router.push('/dashboard')} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all border-white/5">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center space-y-12 max-w-2xl">
            <div className="space-y-4">
               <Brain className="w-24 h-24 text-primary-cyber mx-auto animate-pulse shadow-[0_0_50px_rgba(0,243,255,0.4)]" />
               <h1 className="text-8xl font-black italic uppercase text-glow-premium tracking-tighter leading-none">TRIVIA<br/>MASTER</h1>
               <p className="text-slate-500 text-sm uppercase tracking-[0.4em]">Neural Archive Data Retrieval</p>
            </div>
            <NeonButton size="lg" className="h-20 px-12 text-2xl" onClick={() => setGameState('playing')}>INITIALIZE SYNC</NeonButton>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: -20, opacity: 0 }} className="z-10 w-full max-w-4xl space-y-12">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Question {currentIdx + 1} of {QUESTIONS.length}</div>
                  <div className="text-2xl font-black italic text-white uppercase tracking-tighter">Archive Node Alpha</div>
               </div>
               <div className="flex gap-8 items-center">
                  <div className="text-right">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Time Sync</div>
                     <div className={cn("text-4xl font-black italic", timeLeft < 5 ? "text-red-500 animate-pulse" : "text-primary-cyber")}>{timeLeft}s</div>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-right">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">XP Points</div>
                     <div className="text-4xl font-black italic text-white">{score}</div>
                  </div>
               </div>
            </div>

            <HolographicCard className="p-16 border-white/5 bg-white/[0.02]">
               <h2 className="text-4xl font-black text-white italic leading-tight mb-12 uppercase tracking-tight">
                  {QUESTIONS[currentIdx].q}
               </h2>

               <div className="grid grid-cols-2 gap-6">
                  {QUESTIONS[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === QUESTIONS[currentIdx].a
                    const isSelected = selectedIdx === i
                    
                    let borderColor = "border-white/10"
                    let bgColor = "bg-white/5"
                    let textColor = "text-slate-400"

                    if (showCorrect) {
                       if (isCorrect) {
                          borderColor = "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                          bgColor = "bg-green-500/10"
                          textColor = "text-green-500"
                       } else if (isSelected) {
                          borderColor = "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          bgColor = "bg-red-500/10"
                          textColor = "text-red-500"
                       }
                    } else {
                       borderColor = "hover:border-primary-cyber/50"
                       textColor = "group-hover:text-white"
                    }

                    return (
                      <motion.button
                        key={i}
                        whileHover={!showCorrect ? { scale: 1.02, x: 5 } : {}}
                        whileTap={!showCorrect ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(i)}
                        disabled={showCorrect}
                        className={cn("group text-left p-8 rounded-3xl border-2 transition-all flex justify-between items-center", borderColor, bgColor, textColor)}
                      >
                        <span className="text-xl font-black italic uppercase tracking-tight">{opt}</span>
                        {showCorrect && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                        {showCorrect && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                      </motion.button>
                    )
                  })}
               </div>
            </HolographicCard>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-5xl space-y-12">
            <div className="text-center space-y-4">
               <Trophy className="w-24 h-24 text-yellow-500 mx-auto drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
               <h2 className="text-7xl font-black uppercase italic tracking-tighter">DEBRIEFING COMPLETE</h2>
               <div className="text-4xl font-black text-primary-cyber italic">Score: {score}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
               {history.map((item, i) => (
                 <HolographicCard key={i} className={cn("p-8 border-l-8", item.isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ARCHIVE NODE {i+1}</div>
                    <p className="text-lg font-black text-white italic mb-4 leading-tight">{item.q}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
                       <div className="space-y-1">
                          <div className="text-slate-600">Your Response</div>
                          <div className={item.isCorrect ? "text-green-500" : "text-red-500"}>{item.userAns}</div>
                       </div>
                       {!item.isCorrect && (
                         <div className="space-y-1">
                            <div className="text-slate-600">Correct Value</div>
                            <div className="text-green-500">{item.correctAns}</div>
                         </div>
                       )}
                    </div>
                 </HolographicCard>
               ))}
            </div>

            <div className="flex gap-6 justify-center">
               <NeonButton className="h-16 px-12 text-lg rounded-2xl" variant="outline" onClick={() => { setScore(0); setCurrentIdx(0); setHistory([]); setGameState('playing'); setTimeLeft(15); setSelectedIdx(null); setShowCorrect(false) }}>NEW SYNC</NeonButton>
               <NeonButton className="h-16 px-12 text-lg rounded-2xl" onClick={() => router.push('/dashboard')}>COLLECT REWARDS</NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
