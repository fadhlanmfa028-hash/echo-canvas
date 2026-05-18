'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, TrendingUp, Palette, Calendar, Zap } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import Navbar from '@/components/Navbar'
import { EMOTION_BG, EMOTIONS } from '@/lib/types'
import { clsx } from 'clsx'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logs, artworks } = useStore()

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, router])

  if (!user) return null

  const recentLogs = logs.slice(0, 7)
  const streak = Math.min(logs.length, 7)
  const avgMood = logs.length
    ? Math.round(logs.slice(0, 7).reduce((a, l) => a + (10 - l.intensity + 1), 0) / Math.min(logs.length, 7) * 10) / 10
    : 0

  const emotionCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.emotion_type] = (acc[l.emotion_type] || 0) + 1
    return acc
  }, {})
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]
  const topEmotionInfo = topEmotion ? EMOTIONS.find(e => e.value === topEmotion[0]) : null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">
            Halo, <span className="gradient-text">{user.display_name || user.username}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Artwork', value: artworks.length, icon: Palette },
            { label: 'Log Emosi', value: logs.length, icon: Calendar },
            { label: 'Streak', value: `${streak} hari`, icon: Zap },
            { label: 'Mood Avg', value: avgMood || '—', icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card">
              <Icon className="w-4 h-4 text-slate-500 mb-3" />
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mood chart */}
          <div className="card">
            <h2 className="font-semibold text-sm mb-4">Mood 7 Hari Terakhir</h2>
            {recentLogs.length > 0 ? (
              <div className="flex items-end gap-2 h-20">
                {[...Array(7)].map((_, i) => {
                  const log = recentLogs[6 - i]
                  const height = log ? Math.round((10 - log.intensity + 1) / 10 * 100) : 0
                  const emotion = log ? EMOTIONS.find(e => e.value === log.emotion_type) : null
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-brand-purple/60 min-h-[4px] transition-all"
                        style={{ height: `${Math.max(height, 8)}%` }}
                        title={log ? `${emotion?.emoji} ${emotion?.label} - Intensitas ${log.intensity}` : ''}
                      />
                      <span className="text-[10px] text-slate-500">{emotion?.emoji || '·'}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-slate-500 text-sm">
                Belum ada data. <Link href="/create" className="text-brand-purple ml-1">Mulai log!</Link>
              </div>
            )}
            {topEmotionInfo && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-xs bg-brand-purple/15 text-violet-300 px-2 py-0.5 rounded-full border border-brand-purple/20">
                  {topEmotionInfo.emoji} {topEmotionInfo.label} terbanyak
                </span>
              </div>
            )}
          </div>

          {/* Recent artworks */}
          <div className="card">
            <h2 className="font-semibold text-sm mb-4">Karya Terbaru</h2>
            {artworks.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {artworks.slice(0, 6).map((art) => (
                  <div
                    key={art.id}
                    className={clsx('aspect-square rounded-xl bg-gradient-to-br', EMOTION_BG[art.emotion_type])}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm h-20">
                Belum ada karya. <Link href="/create" className="text-brand-purple ml-1">Buat sekarang!</Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="card bg-gradient-to-br from-brand-purple/20 to-brand-pink/10 border-brand-purple/20 text-center py-8">
          <Sparkles className="w-8 h-8 text-brand-purple mx-auto mb-3" />
          <h2 className="font-bold text-lg mb-1">Bagaimana perasaanmu hari ini?</h2>
          <p className="text-slate-400 text-sm mb-4">Buat artwork baru dari emosimu sekarang</p>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2">
            <Palette className="w-4 h-4" /> Buat Artwork
          </Link>
        </div>
      </main>
    </div>
  )
}
