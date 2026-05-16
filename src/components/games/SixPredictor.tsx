"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Stars, Text, Sparkles, Line, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { NeonButton } from '@/components/ui/neon-button'
import { useRouter } from 'next/navigation'
import { useUserStore, TEAM_COLORS } from '@/lib/store'
import { ArrowLeft, Ruler, Zap, Trophy, MousePointer2, Info, Compass } from 'lucide-react'
import { HolographicCard } from '@/components/ui/holographic-card'

// --- 3D Components ---

function Stadium() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#051508" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[75, 64]} />
        <meshStandardMaterial color="#020308" />
      </mesh>
      {/* Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3.8, 24]} />
        <meshStandardMaterial color="#d4c4a1" />
      </mesh>
      {/* Boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[55, 55.5, 64]} />
        <meshStandardMaterial color="white" transparent opacity={0.5} />
      </mesh>
      {/* Audience Stands */}
      {Array.from({length: 24}).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(angle) * 65, 5, Math.sin(angle) * 65]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[15, 12, 5]} />
              <meshStandardMaterial color="#0c0d15" />
            </mesh>
            <Sparkles count={20} scale={[15, 8, 1]} size={2} color="#fff" />
          </group>
        )
      })}
    </group>
  )
}

function Batsman() {
  return (
    <group position={[0, 0, 10]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
         <sphereGeometry args={[0.2, 16, 16]} />
         <meshStandardMaterial color="#fca5a5" />
      </mesh>
      {/* Bat at end of swing */}
      <mesh position={[-0.8, 1.2, -0.5]} rotation={[0, Math.PI/3, Math.PI/4]}>
         <boxGeometry args={[0.12, 1.2, 0.35]} />
         <meshStandardMaterial color="#92400e" />
      </mesh>
    </group>
  )
}

function Trajectory({ distance, active, color = "#00f3ff", opacity = 0.8 }: { distance: number, active: boolean, color?: string, opacity?: number }) {
  const points = useMemo(() => {
    const p = []
    const steps = 40
    // Start from batsman at z=10
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const z = 10 - (t * distance)
      const y = Math.sin(t * Math.PI) * (distance / 4)
      p.push(new THREE.Vector3(0, y, z))
    }
    return p
  }, [distance])

  return active ? (
    <Line
      points={points}
      color={color}
      lineWidth={4}
      transparent
      opacity={opacity}
    />
  ) : null
}

// --- Main Page ---

export default function SixPredictor() {
  const [dragDist, setDragDist] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [actual, setActual] = useState<number | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [chances, setChances] = useState(3)
  const [wins, setWins] = useState(0)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [showHowTo, setShowHowTo] = useState(false)
  const { addXP, team } = useUserStore()
  const router = useRouter()

  const handleMouseDown = () => {
    if (actual || gameState !== 'playing') return
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const movement = -e.movementY * 0.6
    setDragDist(prev => Math.min(130, Math.max(0, prev + movement)))
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragDist < 60) {
      setDragDist(0)
      return
    }
    executePrediction()
  }

  const executePrediction = () => {
    const realDistance = Math.floor(Math.random() * 55) + 65 // 65 to 120m
    setActual(realDistance)
    
    const diff = Math.abs(realDistance - dragDist)
    const isWin = diff <= 10

    if (isWin) {
      setWins(w => w + 1)
      setResult('TRAJECTORY SYNCED')
    } else {
      setResult('CALCULATION ERROR')
    }

    setTimeout(() => {
      setActual(null)
      setResult(null)
      setDragDist(0)
      if (chances > 1) {
        setChances(c => c - 1)
      } else {
        setGameState('gameover')
        if (wins + (isWin ? 1 : 0) >= 2) addXP(800)
      }
    }, 4000)
  }

  return (
    <div 
      className="relative h-screen w-screen bg-black overflow-hidden font-outfit select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Premium HUD */}
      <div className="absolute inset-x-0 top-0 z-20 p-8 flex justify-between items-start pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={() => router.push('/dashboard')} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all border-white/5">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setShowHowTo(true)} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all text-primary-cyber border-primary-cyber/20">
            <Info className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-10 items-center pointer-events-auto">
           <div className="text-right">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Trials Left</div>
              <div className="flex gap-2 justify-end mt-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={cn("w-3 h-10 rounded-full transition-all duration-700", i <= chances ? "bg-primary-cyber shadow-[0_0_20px_var(--team-primary)]" : "bg-white/5")} />
                 ))}
              </div>
           </div>
           <div className="w-px h-16 bg-white/10" />
           <div className="text-center">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Success Rate</div>
              <div className="text-6xl font-black italic text-primary-cyber leading-none">{wins}/3</div>
           </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[18, 10, 25]} fov={35} />
        <color attach="background" args={['#020308']} />
        
        <Stadium />
        <Batsman />
        
        {/* Ghost Trajectory during drag */}
        {isDragging && <Trajectory distance={dragDist} active color="#ffffff" opacity={0.3} />}
        {/* Confirmed Trajectory */}
        {dragDist > 0 && !actual && <Trajectory distance={dragDist} active color="var(--team-primary)" />}
        {/* Actual Path */}
        {actual && <Trajectory distance={actual} active color="#ff00ff" />}

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 20, 0]} intensity={1000} color="var(--team-primary)" />
        <ContactShadows opacity={0.6} scale={100} blur={2.5} far={15} />
        <Environment preset="night" />
      </Canvas>

      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl">
             <div className="text-center space-y-12 max-w-2xl px-6">
                <div className="space-y-4">
                   <Compass className="w-16 h-16 text-primary-cyber mx-auto animate-spin-slow shadow-[0_0_50px_rgba(0,243,255,0.4)]" />
                   <h1 className="text-7xl font-black italic uppercase text-glow-premium tracking-tighter leading-none mb-4">SIX<br/>PREDICTOR</h1>
                   <p className="text-slate-500 text-xs uppercase tracking-[0.4em]">Trajectory Analysis Laboratory</p>
                </div>
                <NeonButton size="lg" className="h-16 px-10 text-xl" onClick={() => setGameState('playing')}>INITIALIZE CALCULATIONS</NeonButton>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] italic">Click and Drag Vertical to Estimate Path</div>
             </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/98 backdrop-blur-3xl">
             <div className="text-center space-y-12">
                <Trophy className={cn("w-40 h-40 mx-auto animate-bounce shadow-[0_0_60px_rgba(255,255,255,0.1)]", wins >= 2 ? "text-yellow-500" : "text-slate-800")} />
                <div className="space-y-4">
                   <h2 className="text-6xl font-black uppercase italic text-white tracking-tighter leading-none">{wins >= 2 ? 'MASTER ANALYST' : 'CALCULATION FAILED'}</h2>
                   <div className="text-9xl font-black text-primary-cyber italic leading-none">{wins}/3</div>
                   <p className="text-slate-600 uppercase text-[10px] font-black tracking-[0.4em]">Successful Distance Syncs for {team}</p>
                </div>
                <div className="flex gap-8 justify-center pt-10">
                   <NeonButton className="h-20 px-16 text-xl rounded-[2rem] border-white/10" variant="outline" onClick={() => { setWins(0); setChances(3); setGameState('playing') }}>NEW SESSION</NeonButton>
                   <NeonButton className="h-20 px-16 text-xl rounded-[2rem]" onClick={() => router.push('/dashboard')}>COLLECT XP</NeonButton>
                </div>
             </div>
          </motion.div>
        )}

        {showHowTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8">
             <HolographicCard className="max-w-3xl w-full p-12 space-y-12 border-primary-cyber/20 text-center">
                <div className="text-center space-y-2">
                   <h3 className="text-4xl font-black uppercase italic text-primary-cyber tracking-tighter">Sync Protocol</h3>
                   <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">Ballistics Estimation Training</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-left">
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3 text-lg">
                         <MousePointer2 className="w-6 h-6" /> Tactile Input
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Click and <span className="text-white font-bold italic">DRAG UPWARDS</span> to extend the trajectory.</p>
                   </div>
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3 text-lg">
                         <Zap className="w-6 h-6" /> Calibration
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Stay within <span className="text-white font-bold italic">±10 meters</span> of the actual flight distance.</p>
                   </div>
                </div>

                <NeonButton className="w-full h-16 rounded-2xl text-xl font-black italic uppercase shadow-[0_0_30px_rgba(0,243,255,0.4)]" onClick={() => setShowHowTo(false)}>START CALIBRATION</NeonButton>
             </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag UI Hint */}
      {gameState === 'playing' && !actual && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-center space-y-6">
           <div className="flex flex-col items-center gap-4 opacity-40">
              <MousePointer2 className="w-10 h-10 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Drag Up for Distance</span>
           </div>
           
           <div className={cn("text-9xl font-black italic transition-all duration-300", isDragging ? "text-primary-cyber scale-110" : "text-white/10")}>
              {Math.round(dragDist)}<span className="text-3xl not-italic ml-2 uppercase">m</span>
           </div>
        </div>
      )}

      {/* Results Overlay */}
      <AnimatePresence>
        {actual && (
          <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -200, opacity: 0 }} className="absolute bottom-40 inset-x-0 z-30 text-center">
             <div className="text-slate-600 uppercase font-black text-[10px] tracking-[0.4em] mb-4">Satellite Trajectory Match</div>
             <div className="text-9xl font-black italic text-white leading-none tracking-tighter">{actual}<span className="text-4xl ml-2">m</span></div>
             <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-3xl font-black italic text-secondary-cyber uppercase mt-6 tracking-[0.4em] text-glow-premium">{result}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
