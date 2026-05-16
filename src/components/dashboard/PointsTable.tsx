"use client"

import { motion } from 'framer-motion'
import { HolographicCard } from '@/components/ui/holographic-card'

const STANDINGS = [
  { rank: 1, team: 'KKR', played: 13, won: 9, lost: 3, points: 19, form: ['W', 'W', 'W', 'L', 'W'] },
  { rank: 2, team: 'SRH', played: 13, won: 8, lost: 5, points: 16, form: ['W', 'L', 'W', 'W', 'W'] },
  { rank: 3, team: 'RR', played: 13, won: 8, lost: 5, points: 16, form: ['L', 'L', 'L', 'W', 'W'] },
  { rank: 4, team: 'RCB', played: 13, won: 7, lost: 6, points: 14, form: ['W', 'W', 'W', 'W', 'W'] },
  { rank: 5, team: 'CSK', played: 13, won: 7, lost: 6, points: 14, form: ['W', 'L', 'W', 'L', 'W'] },
  { rank: 6, team: 'DC', played: 14, won: 7, lost: 7, points: 14, form: ['W', 'L', 'W', 'W', 'L'] },
  { rank: 7, team: 'LSG', played: 13, won: 6, lost: 7, points: 12, form: ['L', 'L', 'L', 'W', 'W'] },
  { rank: 8, team: 'GT', played: 13, won: 5, lost: 7, points: 11, form: ['L', 'W', 'L', 'L', 'W'] },
  { rank: 9, team: 'MI', played: 13, won: 4, lost: 9, points: 8, form: ['L', 'W', 'L', 'L', 'L'] },
  { rank: 10, team: 'PBKS', played: 13, won: 4, lost: 9, points: 8, form: ['L', 'L', 'W', 'L', 'L'] },
]

export function PointsTable() {
  return (
    <HolographicCard className="w-full h-full overflow-hidden p-0" glowColor="rgba(0, 243, 255, 0.1)">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className="font-bold uppercase tracking-widest text-primary-cyber">IPL Standings</h3>
        <span className="text-[10px] text-slate-500">Updated: May 15, 2026</span>
      </div>
      
      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-tighter text-slate-500 border-b border-white/5">
              <th className="py-3 px-4">Pos</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4 text-center">P</th>
              <th className="py-3 px-4 text-center">Pts</th>
              <th className="py-3 px-4 text-center">Form</th>
            </tr>
          </thead>
          <tbody>
            {STANDINGS.map((row, i) => (
              <motion.tr 
                key={row.team}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <td className="py-3 px-4 font-mono text-sm">
                  <span className={i < 4 ? "text-primary-cyber font-bold" : "text-slate-400"}>
                    {row.rank}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTeamLogo(row.team)}</span>
                    <span className="font-bold text-sm tracking-tight">{row.team}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-sm text-slate-400">{row.played}</td>
                <td className="py-3 px-4 text-center font-bold text-sm">{row.points}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-1">
                    {row.form.map((res, idx) => (
                      <span 
                        key={idx}
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${
                          res === 'W' ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-red-500/20 text-red-500 border border-red-500/50'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </HolographicCard>
  )
}

function getTeamLogo(id: string) {
  const logos: Record<string, string> = {
    KKR: '⚔️', SRH: '🦅', RR: '👑', RCB: '🦁', CSK: '🐯', DC: '🐯', LSG: '🛰️', GT: '⚡', MI: '🌪️', PBKS: '🦁'
  }
  return logos[id] || '🏏'
}
