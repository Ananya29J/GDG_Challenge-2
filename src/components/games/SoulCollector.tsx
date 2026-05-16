"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Stars, Float, Text, Sparkles, Box, RoundedBox, Environment, ContactShadows, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { NeonButton } from '@/components/ui/neon-button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Ghost, Info, Zap, Users, Shield } from 'lucide-react'
import { useUserStore, TEAM_COLORS } from '@/lib/store'
import { HolographicCard } from '@/components/ui/holographic-card'

// --- Constants ---
const MAP_SIZE = 25
const SOUL_COUNT = 15
const BOT_COUNT = 5

function Spirit({ position, onCollect }: { position: [number, number, number], onCollect: () => void }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    ref.current.rotation.y += 0.05
    ref.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
  })

  return (
    <group ref={ref} position={position}>
      <mesh onClick={onCollect} onPointerOver={onCollect}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <MeshDistortMaterial color="#00f3ff" speed={5} distort={0.5} emissive="#00f3ff" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <Torus args={[0.5, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
         <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={5} />
      </Torus>
      <pointLight color="#00f3ff" intensity={5} distance={5} />
    </group>
  )
}

function Landmark({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
       <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
       </mesh>
       <Sparkles count={50} scale={[1, 8, 1]} size={2} color={color} />
    </group>
  )
}

function Character({ position, color, label, isPlayer = false }: { position: THREE.Vector3, color: string, label: string, isPlayer?: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame(() => {
    ref.current.position.lerp(position, 0.15)
    // Dynamic tilt based on movement could be added here
  })

  return (
    <group ref={ref}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 4, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isPlayer ? 1 : 0.2} metalness={0.8} roughness={0.2} />
      </mesh>
      <Text position={[0, 2.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle" font="/fonts/outfit-bold.json">
        {label}
      </Text>
      {isPlayer && (
        <>
          <pointLight position={[0, 3, 0]} intensity={10} color={color} distance={10} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
             <ringGeometry args={[0.8, 0.9, 32]} />
             <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  )
}

export default function SoulCollector() {
  const { team, addXP, setHighScore } = useUserStore()
  const [score, setScore] = useState({ user: 0, bots: 0 })
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [souls, setSouls] = useState<{id: number, pos: [number, number, number]}[]>([])
  const [bots, setBots] = useState<{id: number, pos: THREE.Vector3, color: string, label: string}[]>([])
  const [showHowTo, setShowHowTo] = useState(false)
  const keys = useRef<{ [key: string]: boolean }>({})
  const router = useRouter()

  // Initialize Game
  useEffect(() => {
    if (gameState === 'playing') {
      const initialSouls = Array.from({ length: SOUL_COUNT }, (_, i) => ({
        id: Math.random(),
        pos: [(Math.random() - 0.5) * MAP_SIZE * 1.5, 1, (Math.random() - 0.5) * MAP_SIZE * 1.5] as [number, number, number]
      }))
      setSouls(initialSouls)

      const teams = Object.keys(TEAM_COLORS).filter(t => t !== team)
      const initialBots = Array.from({ length: BOT_COUNT }, (_, i) => ({
        id: i,
        pos: new THREE.Vector3((Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE),
        color: TEAM_COLORS[teams[i % teams.length]],
        label: `${teams[i % teams.length]} AI`
      }))
      setBots(initialBots)
      setPlayerPosition(new THREE.Vector3(0, 0, 0))
      setScore({ user: 0, bots: 0 })
      setTimeLeft(60)
    }
  }, [gameState, team])

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const handleKeyDown = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = true
    const handleKeyUp = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = false
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    const gameLoop = setInterval(() => {
      // Player Movement
      setPlayerPosition(prev => {
        const next = prev.clone()
        const speed = 0.4
        if (keys.current['w'] || keys.current['arrowup']) next.z -= speed
        if (keys.current['s'] || keys.current['arrowdown']) next.z += speed
        if (keys.current['a'] || keys.current['arrowleft']) next.x -= speed
        if (keys.current['d'] || keys.current['arrowright']) next.x += speed
        
        next.x = Math.max(-MAP_SIZE, Math.min(MAP_SIZE, next.x))
        next.z = Math.max(-MAP_SIZE, Math.min(MAP_SIZE, next.z))
        
        return next
      })

      // Bot Logic
      setBots(prev => prev.map(bot => {
        if (souls.length === 0) return bot
        // Find nearest soul
        let nearest = souls[0]
        let minDist = bot.pos.distanceTo(new THREE.Vector3(...nearest.pos))
        souls.forEach(s => {
          const d = bot.pos.distanceTo(new THREE.Vector3(...s.pos))
          if (d < minDist) {
            minDist = d
            nearest = s
          }
        })
        
        const dir = new THREE.Vector3(...nearest.pos).sub(bot.pos).normalize().multiplyScalar(0.35)
        const nextPos = bot.pos.clone().add(dir)
        
        if (minDist < 1.2) {
           collectSoul(nearest.id, false)
        }
        
        return { ...bot, pos: nextPos }
      }))

    }, 16)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(gameLoop)
    }
  }, [gameState, souls])

  // Collision & Timer
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('gameover')
          setHighScore('souls', score.user)
          return 0
        }
        return t - 1
      })
    }, 1000)

    const collisionCheck = setInterval(() => {
       souls.forEach(s => {
          if (playerPosition.distanceTo(new THREE.Vector3(...s.pos)) < 1.5) {
             collectSoul(s.id, true)
          }
       })
    }, 50)

    return () => {
      clearInterval(timer)
      clearInterval(collisionCheck)
    }
  }, [gameState, souls, playerPosition, score.user])

  const collectSoul = (id: number, isUser: boolean) => {
    setSouls(prev => {
      const exists = prev.find(s => s.id === id)
      if (!exists) return prev
      
      if (isUser) {
        setScore(s => ({ ...s, user: s.user + 1 }))
        addXP(25)
      } else {
        setScore(s => ({ ...s, bots: s.bots + 1 }))
      }

      const remaining = prev.filter(s => s.id !== id)
      return [...remaining, {
        id: Math.random(),
        pos: [(Math.random() - 0.5) * MAP_SIZE * 1.8, 1, (Math.random() - 0.5) * MAP_SIZE * 1.8] as [number, number, number]
      }]
    })
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
           <div className="flex gap-4">
              <HolographicScore label="YOUR CAPTURES" score={score.user} color={TEAM_COLORS[team || 'CSK']} />
              <HolographicScore label="RIVAL AI SUM" score={score.bots} color="#fff" />
           </div>
           <div className="w-px h-12 bg-white/10" />
           <div className="text-right">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Extraction Window</div>
              <div className={`text-4xl font-black italic ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
           </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 35, 20]} fov={40} rotation={[-1.1, 0, 0]} />
        <color attach="background" args={['#03040a']} />
        
        <Character position={playerPosition} color={TEAM_COLORS[team || 'CSK']} label={`ELITE: ${team}`} isPlayer />
        
        {bots.map(bot => (
          <Character key={bot.id} position={bot.pos} color={bot.color} label={bot.label} />
        ))}

        {souls.map(soul => (
          <Spirit key={soul.id} position={soul.pos} onCollect={() => collectSoul(soul.id, true)} />
        ))}

        {/* World Landmarks */}
        <Landmark position={[20, 0, 20]} color="#ff00ff" />
        <Landmark position={[-20, 0, -20]} color="#00ffff" />
        <Landmark position={[20, 0, -20]} color="#ffff00" />
        <Landmark position={[-20, 0, 20]} color="#00ff00" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 50, 0]} angle={0.6} penumbra={1} intensity={1000} castShadow color="var(--team-primary)" />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#05060a" roughness={1} />
        </mesh>
        <gridHelper args={[100, 50, "#1e293b", "#03040a"]} position={[0, 0.05, 0]} />
        <ContactShadows opacity={0.6} scale={60} blur={2.5} far={10} />
      </Canvas>

      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl">
             <div className="text-center space-y-12 max-w-2xl px-6">
                <div className="space-y-4">
                   <Ghost className="w-16 h-16 text-primary-cyber mx-auto animate-pulse shadow-[0_0_50px_rgba(0,243,255,0.4)]" />
                   <h1 className="text-6xl font-black italic uppercase text-glow-premium tracking-tighter leading-none">SOUL<br/>COLLECTOR</h1>
                   <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Quantum Extraction Protocol</p>
                </div>
                <NeonButton size="lg" className="h-16 px-10 text-xl" onClick={() => setGameState('playing')}>INITIATE NEURAL SYNC</NeonButton>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] italic">Use WASD or Arrow Keys to Navigate</div>
             </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/98 backdrop-blur-3xl">
             <div className="text-center space-y-12">
                <Users className="w-32 h-32 text-primary-cyber mx-auto animate-bounce" />
                <div className="space-y-2">
                   <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter">HARVEST SECURED</h2>
                   <div className="text-8xl font-black text-primary-cyber italic leading-none">{score.user}</div>
                   <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.4em]">Spirits Encrypted for Team {team}</p>
                </div>
                <div className="flex gap-6 justify-center pt-8">
                   <NeonButton className="h-16 px-12 text-lg rounded-2xl" variant="outline" onClick={() => setGameState('playing')}>RE-SYNC</NeonButton>
                   <NeonButton className="h-16 px-12 text-lg rounded-2xl" onClick={() => router.push('/dashboard')}>CLAIM XP</NeonButton>
                </div>
             </div>
          </motion.div>
        )}

        {showHowTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8">
             <HolographicCard className="max-w-3xl w-full p-12 space-y-12 border-primary-cyber/20">
                <div className="text-center space-y-2">
                   <h3 className="text-4xl font-black uppercase italic text-primary-cyber tracking-tighter">Extraction Intel</h3>
                   <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">Sector Alpha Harvesting</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <Zap className="w-5 h-5" /> Navigations
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Utilize <span className="text-white font-bold italic">WASD</span> or <span className="text-white font-bold italic">Arrow Keys</span>. Maintain constant momentum.</p>
                   </div>
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3">
                         <Shield className="w-5 h-5" /> Hostility
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">AI units from rival teams are active. Intercept them or find unharvested zones.</p>
                   </div>
                </div>

                <NeonButton className="w-full h-16 rounded-2xl text-xl font-black italic uppercase" onClick={() => setShowHowTo(false)}>START HARVEST</NeonButton>
             </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HolographicScore({ label, score, color }: any) {
  return (
    <div className="premium-glass px-10 py-6 rounded-[2rem] border-l-8 transition-all hover:scale-105" style={{ borderColor: color }}>
       <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</div>
       <div className="text-4xl font-black italic text-white leading-none">{score}</div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
