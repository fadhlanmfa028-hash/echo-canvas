'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Semua field wajib diisi'); return }
    setLoading(true)
    setError('')
    try {
      const user = login(email, password)
      if (user) { setUser(user); router.push('/dashboard') }
      else setError('Email atau password salah')
    } catch { setError('Terjadi kesalahan') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-brand-purple" />
            <span className="font-semibold text-lg gradient-text">EchoCanvas</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Selamat Datang Kembali</h1>
          <p className="text-slate-400 text-sm">Masuk ke akun kamu</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input className="form-input" type="email" placeholder="kamu@email.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-4">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-brand-purple hover:text-violet-400">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
