"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Stars, Text, Sparkles, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { NeonButton } from '@/components/ui/neon-button'
import { useRouter } from 'next/navigation'
import { useUserStore, TEAM_COLORS } from '@/lib/store'
import { ArrowLeft, Target, Info, Zap, Trophy, Shield } from 'lucide-react'
import { HolographicCard } from '@/components/ui/holographic-card'

// --- 3D Components ---

function Stadium() {
  return (
    <group>
      {/* Pitch Area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 60]} />
        <meshStandardMaterial color="#c2b280" roughness={1} />
      </mesh>
      {/* Outfield */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#0a2a12" />
      </mesh>
      {/* Stadium Walls */}
      <mesh position={[0, 5, -30]} rotation={[0, 0, 0]}>
         <cylinderGeometry args={[45, 45, 15, 32, 1, true]} />
         <meshStandardMaterial color="#0c0d15" side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function Ball({ isRolling, accuracy, sweetSpot, onComplete }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const [speed] = useState(35)
  const deviation = useRef(0)

  useFrame((state, delta) => {
    if (!isRolling) return
    ref.current.position.z -= speed * delta
    ref.current.rotation.x -= speed * delta
    
    // Deviation based on how far from sweet spot center (range 0-100)
    // sweetSpot is something like {center: 50, width: 10}
    const diff = accuracy - sweetSpot.center
    deviation.current = THREE.MathUtils.lerp(deviation.current, diff / 20, 0.1)
    ref.current.position.x += deviation.current * delta * 5

    if (ref.current.position.z < -14.8) {
      // Hit detection: x should be very close to 0
      const isHit = Math.abs(ref.current.position.x) < 0.25
      onComplete(isHit)
      ref.current.position.z = 12
      ref.current.position.x = 0
      deviation.current = 0
    }
  })

  return (
    <mesh ref={ref} position={[0, 0.25, 12]} castShadow>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      <Sparkles count={20} scale={1} size={3} color="#fff" />
    </mesh>
  )
}

function Stumps({ isHit }: { isHit: boolean }) {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state, delta) => {
    if (isHit) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -Math.PI / 2.2, 0.2)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.4, 0.2)
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -16, 0.1)
    } else {
      group.current.rotation.x = 0
      group.current.position.y = 0
      group.current.position.z = -15
    }
  })

  return (
    <group ref={group} position={[0, 0, -15]}>
      {[ -0.15, 0, 0.15 ].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.9]} />
          <meshStandardMaterial color="#ffcb05" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.92, 0]}>
         <boxGeometry args={[0.35, 0.02, 0.02]} />
         <meshStandardMaterial color="#ffcb05" />
      </mesh>
    </group>
  )
}

// --- Main Page ---

export default function BowlingAce() {
  const [accuracy, setAccuracy] = useState(50)
  const [isRolling, setIsRolling] = useState(false)
  const [isHit, setIsHit] = useState(false)
  const [ballsLeft, setBallsLeft] = useState(10)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [showHowTo, setShowHowTo] = useState(false)
  const [sweetSpot, setSweetSpot] = useState({ center: 50, width: 12 })
  const [oscillationSpeed, setOscillationSpeed] = useState(150)
  
  const { addXP, team } = useUserStore()
  const router = useRouter()
  const requestRef = useRef<number>(null!)

  useEffect(() => {
    const moveSlider = (time: number) => {
      if (!isRolling && gameState === 'playing') {
        setAccuracy((Math.sin(time / oscillationSpeed) + 1) * 50)
      }
      requestRef.current = requestAnimationFrame(moveSlider)
    }
    requestRef.current = requestAnimationFrame(moveSlider)
    return () => cancelAnimationFrame(requestRef.current)
  }, [isRolling, gameState, oscillationSpeed])

  const bowl = () => {
    if (isRolling || ballsLeft <= 0 || gameState !== 'playing') return
    setIsRolling(true)
    setBallsLeft(b => b - 1)
  }

  const onComplete = (hit: boolean) => {
    setIsRolling(false)
    if (hit) {
      setIsHit(true)
      setScore(s => s + 1)
      addXP(150)
      setTimeout(() => setIsHit(false), 1500)
    }
    
    // Update difficulty for next ball
    setSweetSpot({ 
      center: 20 + Math.random() * 60, 
      width: Math.max(6, 12 - (10 - ballsLeft)) 
    })
    setOscillationSpeed(100 + Math.random() * 100)

    if (ballsLeft === 0) {
      setTimeout(() => setGameState('gameover'), 2500)
    }
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-outfit">
      {/* Premium HUD */}
      <div className="absolute inset-x-0 top-0 z-20 p-8 flex justify-between items-start pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={() => router.push('/dashboard')} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setShowHowTo(true)} className="p-4 premium-glass rounded-2xl hover:scale-110 transition-all text-primary-cyber">
            <Info className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-8 items-center pointer-events-auto">
           <div className="text-center">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Overs Remaining</div>
              <div className="text-4xl font-black italic">{ballsLeft}</div>
           </div>
           <div className="w-px h-12 bg-white/10" />
           <div className="text-center">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Stumps Shattered</div>
              <div className="text-5xl font-black italic text-primary-cyber">{score}</div>
           </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={40} rotation={[-0.2, 0, 0]} />
        <color attach="background" args={['#05060b']} />
        
        <Stadium />
        <Ball isRolling={isRolling} accuracy={accuracy} sweetSpot={sweetSpot} onComplete={onComplete} />
        <Stumps isHit={isHit} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 20, 10]} angle={0.4} penumbra={1} intensity={800} color="var(--team-primary)" castShadow />
        <ContactShadows opacity={0.6} scale={40} blur={2.5} far={10} />
        <Environment preset="night" />
      </Canvas>

      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl">
             <div className="text-center space-y-12 max-w-2xl px-6">
                <div className="space-y-4">
                   <Target className="w-16 h-16 text-primary-cyber mx-auto animate-pulse shadow-[0_0_50px_rgba(0,243,255,0.4)]" />
                   <h1 className="text-6xl font-black italic uppercase text-glow-premium tracking-tighter leading-none">BOWLING<br/>ACE</h1>
                   <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Elite Precision Delivery Lab</p>
                </div>
                <NeonButton size="lg" className="h-16 px-10 text-xl" onClick={() => setGameState('playing')}>SYNC TRAJECTORY</NeonButton>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] italic">Calibration Required for Each Ball</div>
             </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/98 backdrop-blur-3xl">
             <div className="text-center space-y-12">
                <Trophy className="w-32 h-32 text-yellow-500 mx-auto animate-bounce shadow-[0_0_50px_rgba(234,179,8,0.4)]" />
                <div className="space-y-2">
                   <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter">OVERS COMPLETED</h2>
                   <div className="text-8xl font-black text-primary-cyber italic leading-none">{score}</div>
                   <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.4em]">Direct Hits for Team {team}</p>
                </div>
                <div className="flex gap-6 justify-center pt-8">
                   <NeonButton className="h-16 px-12 text-lg rounded-2xl" variant="outline" onClick={() => { setScore(0); setBallsLeft(10); setGameState('playing') }}>NEW SESSION</NeonButton>
                   <NeonButton className="h-16 px-12 text-lg rounded-2xl" onClick={() => router.push('/dashboard')}>COLLECT XP</NeonButton>
                </div>
             </div>
          </motion.div>
        )}

        {showHowTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8">
             <HolographicCard className="max-w-3xl w-full p-12 space-y-12 border-primary-cyber/20">
                <div className="text-center space-y-2">
                   <h3 className="text-4xl font-black uppercase italic text-primary-cyber tracking-tighter">Bowling Protocol</h3>
                   <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">High-Fidelity Delivery System</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <Zap className="w-5 h-5" /> Calibration
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Release when the pointer is within the <span className="text-yellow-500 font-bold italic">SWEET SPOT</span>. The spot shifts every delivery.</p>
                   </div>
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <Shield className="w-5 h-5" /> Stumping
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Direct hits yield <span className="text-white font-bold italic">150 XP</span>.</p>
                   </div>
                </div>

                <NeonButton className="w-full h-16 rounded-2xl text-xl font-black italic uppercase" onClick={() => setShowHowTo(false)}>START OVERS</NeonButton>
             </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accuracy Meter UI */}
      {gameState === 'playing' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl space-y-12 px-6">
           <div className="relative h-10 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Sweet Spot */}
              <motion.div 
                className="absolute h-full bg-yellow-500/30 border-x-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                animate={{ 
                  left: `${sweetSpot.center - sweetSpot.width/2}%`,
                  width: `${sweetSpot.width}%` 
                }}
                transition={{ type: 'spring', damping: 20 }}
              />
              {/* Scanner Pointer */}
              <motion.div 
                className="absolute w-2 h-full bg-white z-20 shadow-[0_0_15px_#fff]"
                animate={{ left: `${accuracy}%` }}
                transition={{ type: 'tween', ease: 'linear', duration: 0 }}
                style={{ transform: 'translateX(-50%)' }}
              />
              {/* Center Line */}
              <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-white/20" />
           </div>
           
           <div className="flex justify-center">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={bowl}
               disabled={isRolling}
               className="w-full h-24 rounded-[2rem] bg-primary-cyber text-black font-black uppercase italic tracking-[0.3em] text-2xl shadow-[0_0_50px_rgba(0,243,255,0.5)] hover:shadow-[0_0_80px_rgba(0,243,255,0.7)] transition-all disabled:opacity-50 disabled:grayscale"
             >
               {isRolling ? 'TRAJECTORY LOCKED' : 'RELEASE DELIVERY'}
             </motion.button>
           </div>
        </div>
      )}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
