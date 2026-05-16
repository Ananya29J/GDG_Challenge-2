"use client"

import { useEffect, useState } from 'react'
import { useUserStore } from '@/lib/store'
import Onboarding from '@/components/onboarding/Onboarding'
import { useRouter } from 'next/navigation'

export default function Home() {
  const team = useUserStore((state) => state.team)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (team) {
      router.push('/dashboard')
    }
  }, [team, router])

  if (!mounted) return null

  return <Onboarding />
}
