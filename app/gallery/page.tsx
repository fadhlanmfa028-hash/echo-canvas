'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/stores/useStore'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Palette } from 'lucide-react'
import { EMOTION_BG, EMOTIONS } from '@/lib/types'
import { clsx } from 'clsx'

export default function GalleryPage() {
  const router = useRouter()
  const { isAuthenticated, artworks } = useStore()
  useEffect(() => { if (!isAuthenticated) router.push('/auth/login') }, [isAuthenticated, router])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Galeri</h1>
          <p className="text-slate-400 text-sm">{artworks.length} karya tersimpan</p>
        </div>

        {artworks.length === 0 ? (
          <div className="card text-center py-16">
            <Palette className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">Belum ada karya. Buat yang pertama!</p>
            <Link href="/create" className="btn-primary inline-flex">Buat Artwork</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map((art) => {
              const emotionInfo = EMOTIONS.find(e => e.value === art.emotion_type)
              return (
                <div key={art.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                  {art.image_url?.startsWith('data:') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={art.image_url} alt="artwork" className="w-full h-full object-cover" />
                  ) : (
                    <div className={clsx('w-full h-full bg-gradient-to-br', EMOTION_BG[art.emotion_type])} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end p-3">
                    <div className="opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white text-xs font-medium">{emotionInfo?.emoji} {emotionInfo?.label}</p>
                      <p className="text-white/60 text-[10px]">{new Date(art.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
