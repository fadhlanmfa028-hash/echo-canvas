'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/stores/useStore'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { EMOTIONS, EMOTION_BG } from '@/lib/types'
import { clsx } from 'clsx'

export default function JourneyPage() {
  const router = useRouter()
  const { isAuthenticated, logs } = useStore()
  useEffect(() => { if (!isAuthenticated) router.push('/auth/login') }, [isAuthenticated, router])

  const emotionCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.emotion_type] = (acc[l.emotion_type] || 0) + 1
    return acc
  }, {})

  const sorted = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])
  const maxCount = sorted[0]?.[1] || 1

  const last7 = logs.slice(0, 7).reverse()
  const avgIntensity = logs.length ? (logs.reduce((a, l) => a + l.intensity, 0) / logs.length).toFixed(1) : '—'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Perjalanan Emosi</h1>
          <p className="text-slate-400 text-sm">Lacak pola emosionalmu dari waktu ke waktu</p>
        </div>

        {logs.length === 0 ? (
          <div className="card text-center py-16">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">Belum ada data. Mulai log emosimu!</p>
            <Link href="/create" className="btn-primary inline-flex">Log Emosi Sekarang</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="card"><p className="text-xs text-slate-500 mb-1">Total Log</p><p className="text-2xl font-bold">{logs.length}</p></div>
              <div className="card"><p className="text-xs text-slate-500 mb-1">Rata-rata Intensitas</p><p className="text-2xl font-bold">{avgIntensity}</p></div>
              <div className="card"><p className="text-xs text-slate-500 mb-1">Emosi Terbanyak</p>
                <p className="text-xl">{sorted[0] ? EMOTIONS.find(e => e.value === sorted[0][0])?.emoji : '—'}</p>
              </div>
            </div>

            {/* Mood chart 7 hari */}
            <div className="card mb-6">
              <h2 className="font-semibold text-sm mb-4">Tren Mood (7 Log Terakhir)</h2>
              <div className="flex items-end gap-3 h-24">
                {last7.map((log, i) => {
                  const pct = Math.round(((10 - log.intensity + 1) / 10) * 100)
                  const em = EMOTIONS.find(e => e.value === log.emotion_type)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-brand-purple/70 min-h-[4px]" style={{ height: `${Math.max(pct, 8)}%` }} title={`${em?.label} - Intensitas ${log.intensity}`} />
                      <span className="text-xs">{em?.emoji}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Distribusi emosi */}
            <div className="card mb-6">
              <h2 className="font-semibold text-sm mb-4">Distribusi Emosi</h2>
              <div className="space-y-3">
                {sorted.map(([emotion, count]) => {
                  const em = EMOTIONS.find(e => e.value === emotion)
                  const pct = Math.round((count / maxCount) * 100)
                  return (
                    <div key={emotion}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{em?.emoji} {em?.label}</span>
                        <span className="text-slate-400">{count}x</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full">
                        <div className="h-full bg-brand-purple rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Log history */}
            <div className="card">
              <h2 className="font-semibold text-sm mb-4">Riwayat Log</h2>
              <div className="space-y-3">
                {logs.slice(0, 10).map((log) => {
                  const em = EMOTIONS.find(e => e.value === log.emotion_type)
                  return (
                    <div key={log.id} className="flex gap-3 items-start pb-3 border-b border-white/[0.06] last:border-0">
                      <div className={clsx('w-9 h-9 rounded-xl bg-gradient-to-br flex-shrink-0', EMOTION_BG[log.emotion_type])} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium">{em?.emoji} {em?.label}</span>
                          <span className="text-xs text-slate-500">Intensitas {log.intensity}/10</span>
                        </div>
                        {log.ai_analysis && <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{log.ai_analysis}</p>}
                        <p className="text-[10px] text-slate-600 mt-1">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
