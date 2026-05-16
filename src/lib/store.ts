import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  team: string | null
  xp: number
  level: number
  streak: number
  loyaltyScore: number
  highScores: Record<string, number>
  setTeam: (team: string) => void
  addXP: (amount: number) => void
  setHighScore: (gameId: string, score: number) => void
  reset: () => void
}

export const TEAM_COLORS: Record<string, string> = {
  CSK: '#ffcb05', MI: '#004ba0', RCB: '#ec1c24', KKR: '#3a225d',
  SRH: '#f26522', RR: '#ea1a85', GT: '#1b2133', LSG: '#0057a3',
  DC: '#00008b', PBKS: '#ed1b24'
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      team: null,
      xp: 0,
      level: 1,
      streak: 0,
      loyaltyScore: 0,
      highScores: {},
      setTeam: (team) => set({ team }),
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount
        const newLevel = Math.floor(newXP / 1000) + 1
        return { xp: newXP, level: newLevel }
      }),
      setHighScore: (gameId, score) => set((state) => ({
        highScores: { ...state.highScores, [gameId]: Math.max(state.highScores[gameId] || 0, score) }
      })),
      reset: () => set({ team: null, xp: 0, level: 1, streak: 0, loyaltyScore: 0, highScores: {} }),
    }),
    {
      name: 'fanverse-user-storage',
    }
  )
)
