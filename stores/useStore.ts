'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, EmotionLog, Artwork } from '@/lib/types'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  setUser: (u: User | null) => void
  logout: () => void

  logs: EmotionLog[]
  addLog: (log: EmotionLog) => void

  artworks: Artwork[]
  addArtwork: (art: Artwork) => void

  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      logs: [],
      addLog: (log) => set((s) => ({ logs: [log, ...s.logs].slice(0, 100) })),

      artworks: [],
      addArtwork: (art) => set((s) => ({ artworks: [art, ...s.artworks].slice(0, 50) })),

      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),
    }),
    {
      name: 'echocanvas',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, logs: s.logs, artworks: s.artworks }),
    }
  )
)
