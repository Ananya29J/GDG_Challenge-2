"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Stars, Float, Text, Sparkles, Box, Environment, ContactShadows, useTexture, Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { NeonButton } from '@/components/ui/neon-button'
import { useUserStore, TEAM_COLORS } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Info, Heart, Zap, Target, Users, Play } from 'lucide-react'
import { HolographicCard } from '@/components/ui/holographic-card'

// --- 3D Components ---

function Crowd() {
  const stands = useMemo(() => {
    const s = []
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2
      const x = Math.cos(angle) * 55
      const z = Math.sin(angle) * 55
      s.push({ x, z, rotation: -angle + Math.PI / 2 })
    }
    return s
  }, [])

  return (
    <group>
      {stands.map((s, i) => (
        <group key={i} position={[s.x, 6, s.z]} rotation={[0, s.rotation, 0]}>
           {/* Tiered Stands */}
           <mesh position={[0, -2, 0]}>
              <boxGeometry args={[10, 12, 4]} />
              <meshStandardMaterial color="#0c0d15" roughness={0.9} />
           </mesh>
           {/* Animated Crowd Texture (Emissive Lights) */}
           <mesh position={[0, 2, -1.8]}>
              <planeGeometry args={[9, 5]} />
              <meshStandardMaterial 
                emissive="#1a1b26" 
                emissiveIntensity={3} 
                color="#050508"
              />
           </mesh>
           <Sparkles count={30} scale={[9, 5, 1]} size={2} speed={0.4} color="#ffffff" />
        </group>
      ))}
    </group>
  )
}

function Pitch() {
  return (
    <group>
      {/* Stadium Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[65, 64]} />
        <meshStandardMaterial color="#051508" roughness={1} />
      </mesh>
      {/* Main Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#0a2a12" roughness={0.8} />
      </mesh>
      {/* The 22-Yard Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[3.8, 24]} />
        <meshStandardMaterial color="#d4c4a1" roughness={1} />
      </mesh>
      {/* Creases */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]}>
        <planeGeometry args={[3.8, 0.15]} />
        <meshStandardMaterial color="white" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]}>
        <planeGeometry args={[3.8, 0.15]} />
        <meshStandardMaterial color="white" transparent opacity={0.6} />
      </mesh>
      {/* Boundary Ropes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[48, 48.4, 64]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  )
}

function Wickets({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.14, 0, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.9]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
    </group>
  )
}

function Fielder({ position, rotation = 0, color = "#fff", ballPos }: any) {
  const ref = useRef<THREE.Group>(null!)
  const speed = 2
  
  useFrame((state, delta) => {
    if (ballPos && ballPos.z < 0) {
      // Move towards ball if it's hit
      const target = new THREE.Vector3(ballPos.x, 0, ballPos.z)
      const dist = ref.current.position.distanceTo(target)
      if (dist > 2) {
        const dir = target.sub(ref.current.position).normalize().multiplyScalar(speed * delta * 5)
        ref.current.position.add(dir)
        ref.current.rotation.y = Math.atan2(dir.x, dir.z)
      }
    }
  })

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.7, 4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
         <sphereGeometry args={[0.18, 16, 16]} />
         <meshStandardMaterial color="#fca5a5" />
      </mesh>
    </group>
  )
}

function Bowler({ active, ballPos }: { active: boolean, ballPos: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (active) {
      // Run-up animation
      const cycle = Math.sin(state.clock.elapsedTime * 8)
      ref.current.position.z = -22 + cycle * 0.3
      ref.current.position.y = Math.abs(cycle) * 0.15
      ref.current.rotation.x = cycle * 0.05
    }
  })

  return (
    <group ref={ref} position={[0, 0, -22]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      {/* Bowling Arm */}
      <mesh position={[0.4, 1.3, 0]} rotation={[active ? Math.sin(Date.now() / 100) * 2 : 0, 0, 0]}>
         <cylinderGeometry args={[0.05, 0.05, 0.8]} />
         <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Bat({ isSwinging }: { isSwinging: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state, delta) => {
    if (isSwinging) {
      // Powerful swing arc
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, Math.PI / 1.1, 0.3)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -Math.PI / 4, 0.3)
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, -0.5, 0.3)
    } else {
      // Relaxed stance
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, -Math.PI / 3, 0.1)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.2, 0.1)
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, 0.6, 0.1)
    }
  })

  return (
    <group ref={ref} position={[0.6, 0, 10]}>
      <group position={[0, 0.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 1.2, 0.4]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.7]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      </group>
    </group>
  )
}

function Ball({ active, speed, onOut, onRef }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const [inFlight, setInFlight] = useState(false)
  
  useEffect(() => {
    if (ref.current) onRef(ref.current)
  }, [ref, onRef])

  useFrame((state, delta) => {
    if (!active || inFlight) return
    ref.current.position.z += speed * delta
    
    // Check if passed batsman or hit wickets
    if (ref.current.position.z > 10.5 && ref.current.position.z < 10.8) {
      if (Math.abs(ref.current.position.x) < 0.25) {
        onOut()
        reset()
      }
    }
    
    if (ref.current.position.z > 20) {
      reset()
    }
  })

  const reset = () => {
    ref.current.position.z = -20
    ref.current.position.x = (Math.random() - 0.5) * 1.6
    ref.current.position.y = 0.5 + Math.random() * 0.5
    setInFlight(false)
  }

  return (
    <mesh ref={ref} position={[0, 0.5, -20]} castShadow>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      <Sparkles count={12} scale={0.6} size={3} color="#fff" />
    </mesh>
  )
}

function GameController({ gameState, isSwinging, ballRef, onHit, setIsSwinging }: any) {
  useFrame(() => {
    if (gameState === 'playing' && isSwinging && ballRef) {
      const bPos = ballRef.position
      // Batting zone z=9.5 to 10.5
      if (bPos.z > 9.2 && bPos.z < 10.8) {
        const dist = Math.abs(bPos.z - 10)
        let points = 1
        if (dist < 0.15) points = 6
        else if (dist < 0.4) points = 4
        else if (dist < 0.8) points = 2
        
        onHit(points)
        
        // Dynamic ball flight
        bPos.z = -10
        bPos.x = (Math.random() - 0.5) * 80
        bPos.y = 15 + Math.random() * 20
        setIsSwinging(false)
      }
    }
  })
  return null
}

function HitFeedback({ type, position }: { type: string | null, position: THREE.Vector3 }) {
  if (!type) return null
  return (
    <Float speed={8} rotationIntensity={3} floatIntensity={3}>
      <Text
        position={[0, 6, -10]}
        fontSize={4}
        color={type === 'SIX' ? '#00f3ff' : type === 'FOUR' ? '#eab308' : type === 'OUT' ? '#ef4444' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {type}
      </Text>
    </Float>
  )
}

// --- Main Experience ---

export default function BattingBlitz() {
  const [mode, setMode] = useState<'time' | 'wicket' | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [lives, setLives] = useState(3)
  const [isSwinging, setIsSwinging] = useState(false)
  const [ballRef, setBallRef] = useState<THREE.Mesh | null>(null)
  const [hitType, setHitType] = useState<string | null>(null)
  const [showHowTo, setShowHowTo] = useState(false)
  const { addXP, team } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (gameState === 'playing' && mode === 'time') {
      const t = setInterval(() => setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(t)
          setGameState('gameover')
          return 0
        }
        return prev - 1
      }), 1000)
      return () => clearInterval(t)
    }
  }, [gameState, mode])

  const handleOut = () => {
    if (mode === 'wicket') {
      setLives(l => {
        if (l <= 1) {
          setGameState('gameover')
          return 0
        }
        return l - 1
      })
    }
    setHitType('OUT')
    setTimeout(() => setHitType(null), 1200)
  }

  const swing = () => {
    if (gameState !== 'playing' || isSwinging) return
    setIsSwinging(true)
    setTimeout(() => setIsSwinging(false), 300)
  }

  const onHit = (points: number) => {
    setScore(s => s + points)
    addXP(points * 20)
    setHitType(points === 6 ? 'SIX' : points === 4 ? 'FOUR' : points === 2 ? 'DOUBLE' : 'SINGLE')
    setTimeout(() => setHitType(null), 1500)
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-outfit select-none" onMouseDown={swing}>
      {/* High-Fidelity Scoreboard HUD */}
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
           {mode === 'time' && (
              <div className="text-right">
                 <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Overs Remaining</div>
                 <div className="text-5xl font-black italic text-glow-premium">{timeLeft}s</div>
              </div>
           )}
           {mode === 'wicket' && (
              <div className="flex gap-4 items-center">
                 <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mr-2">Wickets</div>
                 <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-3 h-12 rounded-full transition-all duration-700 ${i <= lives ? 'bg-primary-cyber shadow-[0_0_20px_var(--team-primary)]' : 'bg-white/5'}`} />
                    ))}
                 </div>
              </div>
           )}
           <div className="w-px h-16 bg-white/10" />
           <div className="text-center">
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Total Runs</div>
              <div className="text-6xl font-black italic text-primary-cyber leading-none">{score}</div>
           </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 6, 22]} fov={35} rotation={[-0.15, 0, 0]} />
        <color attach="background" args={['#020308']} />
        
        <Pitch />
        <Crowd />
        <Wickets position={[0, 0, 10.4]} />
        <Wickets position={[0, 0, -11]} />
        
        {/* Fielders in a circle */}
        <Fielder position={[20, 0, -30]} rotation={Math.PI / 4} color="#fca5a5" ballPos={ballRef?.position} />
        <Fielder position={[-25, 0, -10]} rotation={-Math.PI / 3} color="#fca5a5" ballPos={ballRef?.position} />
        <Fielder position={[35, 0, 20]} rotation={Math.PI / 1.2} color="#fca5a5" ballPos={ballRef?.position} />
        <Fielder position={[-40, 0, 40]} rotation={Math.PI / 1.5} color="#fca5a5" ballPos={ballRef?.position} />
        <Fielder position={[0, 0, -45]} rotation={0} color="#fca5a5" ballPos={ballRef?.position} />

        <GameController 
          gameState={gameState} 
          isSwinging={isSwinging} 
          ballRef={ballRef} 
          onHit={onHit}
          setIsSwinging={setIsSwinging} 
        />
        <Ball 
          active={gameState === 'playing'} 
          speed={mode === 'time' ? 24 : 30} 
          onOut={handleOut}
          onRef={setBallRef}
        />
        <Bat isSwinging={isSwinging} />
        <Bowler active={gameState === 'playing'} ballPos={ballRef?.position || new THREE.Vector3()} />
        <HitFeedback type={hitType} position={ballRef?.position || new THREE.Vector3()} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <spotLight position={[0, 30, 0]} angle={0.5} penumbra={1} intensity={1000} castShadow color="#fff" />
        <spotLight position={[20, 20, 20]} angle={0.5} intensity={500} color="var(--team-primary)" />
        <ContactShadows opacity={0.5} scale={60} blur={2.5} far={15} />
        <Environment preset="night" />
      </Canvas>

      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="text-center space-y-12 max-w-2xl px-6">
              <div className="space-y-4">
                <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="inline-block p-3 rounded-2xl bg-primary-cyber/10 border border-primary-cyber/20 text-primary-cyber text-[10px] font-black uppercase tracking-[0.4em] mb-4">🏟️ Stadium Live</motion.div>
                <h1 className="text-7xl font-black italic uppercase text-glow-premium tracking-tighter leading-none mb-4">BATTING<br/>BLITZ</h1>
                <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Elite Cricket Simulation v2.0</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <MenuOption 
                  title="T20 POWER" 
                  desc="60s Rapid Score" 
                  icon={<Zap className="w-8 h-8" />}
                  onClick={() => { setMode('time'); setGameState('playing') }} 
                />
                <MenuOption 
                  title="ELITE TEST" 
                  desc="3 Wickets Survival" 
                  icon={<Target className="w-8 h-8" />}
                  onClick={() => { setMode('wicket'); setGameState('playing') }} 
                />
              </div>
              
              <div className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em] animate-pulse italic">Click Anywhere to Swing • Perfect Timing Required</div>
            </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/98 backdrop-blur-3xl">
            <div className="text-center space-y-12">
              <div className="relative inline-block">
                <Trophy className="w-40 h-40 text-yellow-500 mx-auto drop-shadow-[0_0_60px_rgba(234,179,8,0.7)]" />
                <Sparkles count={100} scale={3} size={3} color="#fbbf24" />
              </div>
              <div className="space-y-2">
                <h2 className="text-6xl font-black uppercase italic text-white tracking-tighter leading-none">INNINGS<br/>COMPLETE</h2>
                <div className="text-9xl font-black text-primary-cyber italic leading-none">{score}</div>
                <p className="text-slate-600 uppercase text-[10px] font-black tracking-[0.4em]">Runs Recorded for Team {team}</p>
              </div>
              <div className="flex gap-8 justify-center pt-10">
                 <NeonButton className="h-20 px-16 text-xl rounded-[2rem] border-white/10" variant="outline" onClick={() => { setScore(0); setTimeLeft(60); setLives(3); setGameState('playing') }}>REPLAY MATCH</NeonButton>
                 <NeonButton className="h-20 px-16 text-xl rounded-[2rem]" onClick={() => router.push('/dashboard')}>COLLECT XP</NeonButton>
              </div>
            </div>
          </motion.div>
        )}

        {showHowTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8">
             <HolographicCard className="max-w-3xl w-full p-12 space-y-12 border-primary-cyber/20">
                <div className="text-center space-y-2">
                   <h3 className="text-4xl font-black uppercase italic text-primary-cyber tracking-tighter">Match Intel</h3>
                   <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">Professional Batting Directives</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-3 text-lg">
                         <Play className="w-5 h-5 fill-current" /> Mechanics
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">Observe the Bowler's run-up. Click or press <span className="text-white font-bold italic">SPACE</span> as the ball hits the crease. Timing defines your score.</p>
                   </div>
                   <div className="space-y-6">
                      <div className="font-black uppercase text-primary-cyber italic flex items-center gap-4 text-lg">
                         <Users className="w-5 h-5" /> Dynamics
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">In <span className="text-white font-bold">Power Play</span>, every ball counts. In <span className="text-white font-bold">Elite Test</span>, survival is key.</p>
                   </div>
                </div>

                <NeonButton className="w-full h-16 rounded-2xl text-xl font-black italic uppercase shadow-[0_0_30px_rgba(0,243,255,0.4)]" onClick={() => setShowHowTo(false)}>START INNINGS</NeonButton>
             </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuOption({ title, desc, icon, onClick }: any) {
  return (
    <motion.button 
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="premium-glass p-12 rounded-[3rem] border-white/5 hover:border-primary-cyber/50 text-left transition-all group relative overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
         {icon}
      </div>
      <div className="text-4xl font-black italic uppercase mb-2 text-white group-hover:text-primary-cyber transition-colors tracking-tight">{title}</div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{desc}</div>
    </motion.button>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
