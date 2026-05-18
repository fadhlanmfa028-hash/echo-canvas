import Link from 'next/link'
import { Sparkles, Brain, Palette, Share2, ArrowRight, Heart, TrendingUp, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto animate-fade-in">
          <span className="inline-block bg-brand-purple/15 text-brand-purple text-xs font-medium px-3 py-1 rounded-full mb-6 border border-brand-purple/20">
            AI Mental Health Art Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
            Ubah Emosimu Jadi<br />
            <span className="gradient-text">Mahakarya Visual</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
            EchoCanvas menggunakan AI untuk mengubah perasaanmu menjadi karya seni yang indah.
            Lacak perjalanan emosionalmu, satu mahakarya dalam satu waktu.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Mulai Gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/gallery" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
              Lihat Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-brand-surface/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Cara Kerjanya</h2>
          <p className="text-slate-400 text-center mb-12">Tiga langkah untuk mengubah emosi jadi seni</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, color: 'text-brand-purple', bg: 'bg-brand-purple/10', title: '1. Log Emosi', desc: 'Ceritakan perasaanmu. AI kami memahami nuansa emosionalmu secara mendalam.' },
              { icon: Palette, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', title: '2. Generate Art', desc: 'Saksikan AI mengubah emosimu menjadi visual art yang unik dan personal.' },
              { icon: Share2, color: 'text-brand-pink', bg: 'bg-brand-pink/10', title: '3. Share & Lacak', desc: 'Bagikan karya atau simpan privat. Lacak perjalanan emosionalmu dari waktu ke waktu.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="card">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kenapa EchoCanvas?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Psychology-Safe', desc: 'Setiap output divalidasi dengan prinsip psikologi klinis. Deteksi krisis otomatis dengan referral ke hotline.' },
              { icon: TrendingUp, title: 'Journey Tracking', desc: 'Lacak pola emosionalmu dari waktu ke waktu. AI memberikan insight personal berdasarkan riwayatmu.' },
              { icon: Sparkles, title: 'AI yang Benar-benar Ngerti', desc: 'Powered by Claude AI — bukan template generik. Setiap analisis dan artwork benar-benar personal.' },
              { icon: Heart, title: 'Micro-Habits', desc: 'Setiap sesi menghasilkan rekomendasi micro-habit yang bisa dilakukan dalam 5 menit untuk wellbeing kamu.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex gap-4">
                <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-brand-pink mx-auto mb-5" />
          <h2 className="text-3xl font-bold mb-3">Mulai Perjalananmu</h2>
          <p className="text-slate-400 mb-7">Gratis, tanpa kartu kredit. Mulai ekspresikan emosimu hari ini.</p>
          <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3">
            Buat Akun Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-6 px-4 text-center text-slate-500 text-sm">
        © 2026 EchoCanvas. Dibangun dengan ❤️ untuk mental health awareness Indonesia.
      </footer>
    </div>
  )
}
