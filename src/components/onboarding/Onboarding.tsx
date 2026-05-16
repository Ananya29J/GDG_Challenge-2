"use client"

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { StadiumEnvironment } from './StadiumEnvironment'
import { HolographicCard } from '@/components/ui/holographic-card'
import { NeonButton } from '@/components/ui/neon-button'
import { useUserStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const TEAMS = [
  { id: 'CSK', name: 'Chennai Super Kings', color: '#ffcb05', accent: 'text-yellow-400', logo: '🦁' },
  { id: 'MI', name: 'Mumbai Indians', color: '#004ba0', accent: 'text-blue-500', logo: '🌪️' },
  { id: 'RCB', name: 'Royal Challengers Bangalore', color: '#ec1c24', accent: 'text-red-600', logo: '👑' },
  { id: 'KKR', name: 'Kolkata Knight Riders', color: '#3a225d', accent: 'text-purple-600', logo: '⚔️' },
  { id: 'SRH', name: 'Sunrisers Hyderabad', color: '#f26522', accent: 'text-orange-500', logo: '🦅' },
  { id: 'RR', name: 'Rajasthan Royals', color: '#ea1a85', accent: 'text-pink-500', logo: '👑' },
  { id: 'GT', name: 'Gujarat Titans', color: '#1b2133', accent: 'text-slate-400', logo: '⚡' },
  { id: 'LSG', name: 'Lucknow Super Giants', color: '#0057a3', accent: 'text-cyan-500', logo: '🛰️' },
  { id: 'DC', name: 'Delhi Capitals', color: '#00008b', accent: 'text-blue-700', logo: '🐯' },
  { id: 'PBKS', name: 'Punjab Kings', color: '#ed1b24', accent: 'text-red-500', logo: '🦁' },
]

export default function Onboarding() {
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0])
  const setTeam = useUserStore((state) => state.setTeam)
  const router = useRouter()

  const handleJoin = () => {
    setTeam(selectedTeam.id)
    router.push('/dashboard')
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadow-enabled="true">
          <StadiumEnvironment teamColor={selectedTeam.color} />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-8 text-white">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black uppercase tracking-tighter text-glow sm:text-7xl">
            Choose Your <span className="text-primary-cyber">Legacy</span>
          </h1>
          <p className="mt-2 text-slate-400">Enter the FanVerse IPL and represent your squad.</p>
        </motion.div>

        <div className="grid w-full max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 overflow-y-auto max-h-[60vh] p-4 custom-scrollbar">
          {TEAMS.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedTeam(team)}
              className="cursor-pointer"
            >
              <HolographicCard 
                className={cn(
                  "h-80 border-2 transition-all duration-300",
                  selectedTeam.id === team.id ? "border-primary-cyber" : "border-transparent opacity-60"
                )}
                glowColor={team.color}
              >
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <span className="text-6xl">{team.logo}</span>
                  <h2 className={cn("text-2xl font-bold text-center", team.accent)}>{team.name}</h2>
                  <div className="h-1 w-12 bg-white/20 rounded-full" />
                  <p className="text-xs text-slate-400 text-center uppercase tracking-widest">Select to preview environment</p>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <NeonButton 
            size="lg" 
            onClick={handleJoin}
            className="w-64"
            style={{ backgroundColor: selectedTeam.color }}
          >
            Pledge Loyalty to {selectedTeam.id}
          </NeonButton>
          <p className="text-sm text-slate-500">You can change your team once per season.</p>
        </motion.div>
      </div>

      {/* Team Transition Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTeam.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-5"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${selectedTeam.color}11 0%, transparent 70%)`
          }}
        />
      </AnimatePresence>
    </div>
  )
}

// Helper because I can't import cn easily in this block without a separate tool call if I forgot
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
