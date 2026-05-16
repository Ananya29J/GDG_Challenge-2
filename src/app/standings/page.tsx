"use client"

import { PointsTable } from '@/components/dashboard/PointsTable'
import { motion } from 'framer-motion'

export default function StandingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase">IPL Standings</h1>
          <p className="text-slate-400 text-sm uppercase tracking-widest">Real-time League Table & Match History</p>
        </div>
        <div className="flex gap-4">
          <FilterBadge label="All Teams" active />
          <FilterBadge label="Playoffs" />
        </div>
      </div>
      
      <div className="h-[calc(100vh-250px)]">
        <PointsTable />
      </div>
    </div>
  )
}

function FilterBadge({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
      active ? 'bg-primary-cyber text-black' : 'border border-white/10 text-slate-400 hover:text-white'
    }`}>
      {label}
    </button>
  )
}
