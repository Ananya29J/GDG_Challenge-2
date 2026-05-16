"use client"

import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'
import { useUserStore } from '@/lib/store'
import { Zap, Trophy, Flame, Play } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { team, xp, level } = useUserStore()

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <HolographicCard className="p-8 border-primary-cyber/20 bg-gradient-to-br from-primary-cyber/10 to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black italic uppercase italic">Welcome Back, Commander</h1>
            <p className="text-slate-400">Your loyalty to {team} is powering the team's global ranking.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/arena">
                <button className="bg-primary-cyber text-black px-6 py-3 rounded-xl font-bold uppercase text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all">
                  <Play className="w-4 h-4 fill-current" /> Join Live Arena
                </button>
             </Link>
          </div>
        </div>
      </HolographicCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total XP" value={xp} sub="Global Rank #1,402" icon={<Zap className="text-primary-cyber" />} />
        <StatCard title="Current Level" value={`Lvl ${level}`} sub={`${1000 - (xp % 1000)} XP to next level`} icon={<Trophy className="text-yellow-500" />} />
        <StatCard title="Win Streak" value="5 Matches" sub="+20% Energy Multiplier" icon={<Flame className="text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="font-bold uppercase tracking-widest text-sm text-slate-500">Recent Engagements</h2>
          <div className="space-y-3">
             <ActivityItem title="Correct Prediction" sub="MS Dhoni Finish" xp="+500" time="2m ago" />
             <ActivityItem title="Batting Blitz" sub="Score: 42 Runs" xp="+120" time="45m ago" />
             <ActivityItem title="Soul Hunter" sub="Day 15 Streak" xp="+250" time="2h ago" />
          </div>
        </section>

        {/* Quick Game */}
        <section className="space-y-4">
          <h2 className="font-bold uppercase tracking-widest text-sm text-slate-500">Daily Mission</h2>
          <HolographicCard className="p-6 border-secondary-cyber/30">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-black italic uppercase text-secondary-cyber">Soul Hunter</h3>
                <span className="text-[10px] bg-secondary-cyber/20 text-secondary-cyber px-2 py-1 rounded">2x REWARDS</span>
             </div>
             <p className="text-sm text-slate-400 mb-6">Collect 50 spirits for your team in a single session.</p>
             <Link href="/games/souls">
                <button className="w-full py-3 rounded-xl border border-secondary-cyber/50 text-secondary-cyber font-bold uppercase text-xs hover:bg-secondary-cyber/10 transition-all">Launch Game</button>
             </Link>
          </HolographicCard>
        </section>
      </div>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <HolographicCard className="p-6 space-y-4 border-white/5">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{title}</span>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-black italic">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase">{sub}</div>
      </div>
    </HolographicCard>
  )
}

function ActivityItem({ title, sub, xp, time }: any) {
  return (
    <div className="glass-morphism p-4 flex justify-between items-center border-white/5 rounded-2xl group hover:border-primary-cyber/30 transition-all">
       <div>
          <div className="font-bold text-sm">{title}</div>
          <div className="text-[10px] text-slate-500 uppercase">{sub}</div>
       </div>
       <div className="text-right">
          <div className="font-black text-primary-cyber text-sm">{xp}</div>
          <div className="text-[8px] text-slate-600 uppercase">{time}</div>
       </div>
    </div>
  )
}
