'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowLeft, Download, Share2, RefreshCw, AlertTriangle, Shield } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/stores/useStore'
import Navbar from '@/components/Navbar'
import { EMOTIONS, STYLES, EMOTION_BG, type EmotionType, type StylePreset, type AnalyzeResponse } from '@/lib/types'
import { clsx } from 'clsx'

const CRISIS_KEYWORDS = ['bunuh diri', 'mati', 'ingin mati', 'tidak ingin hidup', 'suicidal', 'self-harm', 'menyakiti diri']

type Step = 'form' | 'generating' | 'result'

export default function CreatePage() {
  const router = useRouter()
  const { isAuthenticated, addLog, addArtwork } = useStore()

  useEffect(() => { if (!isAuthenticated) router.push('/auth/login') }, [isAuthenticated, router])

  const [step, setStep] = useState<Step>('form')
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | ''>('')
  const [intensity, setIntensity] = useState(5)
  const [description, setDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('cosmic')
  const [genStep, setGenStep] = useState(0)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [artworkId, setArtworkId] = useState('')
  const [artworkImg, setArtworkImg] = useState('')
  const [error, setError] = useState('')
  const [hasCrisis, setHasCrisis] = useState(false)

  const checkCrisis = (text: string) => {
    setHasCrisis(CRISIS_KEYWORDS.some(k => text.toLowerCase().includes(k)))
  }

  const GEN_STEPS = [
    'Menganalisis emosi kamu...',
    'Membangun prompt artistik dengan AI...',
    'Memvalidasi keamanan psikologi...',
    'Generating visual art...',
    'Menyelesaikan karya...',
  ]

  const handleGenerate = async () => {
    if (!selectedEmotion) { setError('Pilih emosi dulu ya!'); return }
    setError('')
    setStep('generating')
    setGenStep(0)

    // Animate steps
    const stepInterval = setInterval(() => setGenStep(s => Math.min(s + 1, GEN_STEPS.length - 1)), 800)

    try {
      // 1. Analyze emotion with Claude AI
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion_type: selectedEmotion, intensity, description, style_preset: selectedStyle }),
      })
      const analysis: AnalyzeResponse = await analyzeRes.json()
      setResult(analysis)

      // 2. Generate artwork
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion_type: selectedEmotion, style_preset: selectedStyle, colors: analysis.colors, art_prompt: analysis.art_prompt }),
      })
      const gen = await genRes.json()

      clearInterval(stepInterval)

      // Save to store
      const logEntry = {
        id: crypto.randomUUID(),
        emotion_type: selectedEmotion,
        intensity,
        description,
        ai_analysis: analysis.analysis,
        micro_habit: analysis.micro_habit,
        risk_level: analysis.risk_level,
        created_at: new Date().toISOString(),
      }
      const artworkEntry = {
        id: gen.id,
        emotion_type: selectedEmotion,
        style_preset: selectedStyle,
        prompt_text: analysis.art_prompt,
        image_url: gen.image_url,
        colors: analysis.colors,
        created_at: gen.created_at,
      }
      addLog(logEntry)
      addArtwork(artworkEntry)

      setArtworkId(gen.id)
      setArtworkImg(gen.image_url)
      setStep('result')
    } catch (err) {
      clearInterval(stepInterval)
      console.error(err)
      setError('Gagal generate artwork. Pastikan ANTHROPIC_API_KEY sudah diset.')
      setStep('form')
    }
  }

  const handleReset = () => {
    setStep('form')
    setSelectedEmotion('')
    setIntensity(5)
    setDescription('')
    setSelectedStyle('cosmic')
    setResult(null)
    setHasCrisis(false)
    setError('')
  }

  const handleDownload = () => {
    if (!artworkImg) return
    const a = document.createElement('a')
    a.href = artworkImg
    a.download = `echocanvas-${selectedEmotion}-${Date.now()}.svg`
    a.click()
  }

  const emotionInfo = EMOTIONS.find(e => e.value === selectedEmotion)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* FORM */}
        {step === 'form' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Buat Artwork</h1>
                <p className="text-slate-400 text-sm">Ceritakan perasaanmu, AI akan mengubahnya jadi seni</p>
              </div>
            </div>

            {/* Crisis banner */}
            {hasCrisis && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm mb-1">Kami mendengarmu 💜</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Kamu tidak sendirian. Jika butuh bantuan segera, hubungi:<br />
                    <strong className="text-red-300">Into The Light Indonesia: 119 ext 8</strong><br />
                    <strong className="text-red-300">Yayasan Pulih: (021) 788-42580</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Emotion selection */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Bagaimana perasaanmu?</h2>
              <div className="grid grid-cols-5 gap-2">
                {EMOTIONS.map((em) => (
                  <button
                    key={em.value}
                    onClick={() => setSelectedEmotion(em.value)}
                    className={clsx(
                      'py-3 px-2 rounded-xl border text-xs font-medium transition-all',
                      selectedEmotion === em.value
                        ? `bg-gradient-to-br ${em.gradient} border-transparent text-white`
                        : 'bg-brand-surface border-white/10 text-slate-400 hover:border-brand-purple/50'
                    )}
                  >
                    <div className="text-lg mb-0.5">{em.emoji}</div>
                    {em.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="card mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-400">Intensitas emosi</span>
                <span className="text-xl font-bold gradient-text">{intensity}/10</span>
                <span className="text-sm text-slate-400">Intens</span>
              </div>
              <input
                type="range" min="1" max="10" value={intensity}
                onChange={e => setIntensity(+e.target.value)}
                className="w-full accent-brand-purple"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-sm">Ceritakan lebih lanjut <span className="text-slate-500 font-normal">(opsional)</span></label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Apa yang ada di pikiranmu? AI akan membuat analisis dan karya yang lebih personal..."
                value={description}
                onChange={e => { setDescription(e.target.value); checkCrisis(e.target.value) }}
              />
              {description.length > 10 && !hasCrisis && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400">
                  <Shield className="w-3 h-3" /> Konten aman
                </div>
              )}
            </div>

            {/* Style */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3 text-sm">Pilih gaya seni</h2>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={clsx(
                      'py-3 px-2 rounded-xl border text-xs transition-all text-center',
                      selectedStyle === style.value
                        ? 'border-brand-purple bg-brand-purple/15 text-violet-300'
                        : 'border-white/10 bg-brand-surface text-slate-400 hover:border-brand-purple/40'
                    )}
                  >
                    <div className="text-xl mb-1">{style.emoji}</div>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={!selectedEmotion}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
            >
              <Sparkles className="w-5 h-5" /> Generate Artwork
            </button>
          </div>
        )}

        {/* GENERATING */}
        {step === 'generating' && (
          <div className="animate-fade-in text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-purple/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Menciptakan Mahakarya</h2>
            <p className="text-slate-400 text-sm mb-8">Claude AI sedang bekerja untuk kamu...</p>
            <div className="max-w-xs mx-auto space-y-2">
              {GEN_STEPS.map((s, i) => (
                <div key={i} className={clsx('flex items-center gap-2 text-sm transition-all', i <= genStep ? 'text-slate-300' : 'text-slate-600')}>
                  <div className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', i <= genStep ? 'bg-brand-purple' : 'bg-slate-600')} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && result && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold gradient-text text-center mb-6">Artworkmu Siap ✨</h1>

            {/* Artwork */}
            <div className={clsx('w-full aspect-square rounded-2xl bg-gradient-to-br mb-4 flex items-center justify-center overflow-hidden', emotionInfo ? EMOTION_BG[emotionInfo.value] : 'from-brand-purple to-brand-pink')}>
              {artworkImg.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={artworkImg} alt="Generated artwork" className="w-full h-full object-cover" />
              ) : (
                <div className="text-white/60 text-sm">Artwork</div>
              )}
            </div>

            {/* Crisis resources jika ada */}
            {result.crisis_resources && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-400 font-medium text-sm mb-2">Sumber bantuan tersedia 💜</p>
                {result.crisis_resources.map((r, i) => (
                  <p key={i} className="text-slate-400 text-xs">{r}</p>
                ))}
              </div>
            )}

            {/* Analysis */}
            <div className="card mb-3">
              <p className="text-xs text-slate-500 mb-1.5">Analisis AI</p>
              <p className="text-sm text-slate-300 leading-relaxed">{result.analysis}</p>
            </div>

            {/* Micro-habit */}
            <div className="card mb-5 border-brand-purple/20 bg-brand-purple/5">
              <p className="text-xs text-slate-500 mb-1.5">Micro-habit untuk kamu</p>
              <p className="text-sm text-violet-300">✨ {result.micro_habit}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={handleDownload} className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5">
                <Download className="w-4 h-4" /> Simpan
              </button>
              <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={handleReset} className="btn-secondary flex items-center justify-center gap-1.5 text-sm py-2.5">
                <RefreshCw className="w-4 h-4" /> Buat Lagi
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
