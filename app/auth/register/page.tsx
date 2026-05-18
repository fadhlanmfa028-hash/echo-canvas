'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { register } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useStore()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) { setError('Semua field wajib diisi'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    try {
      const user = register(form.username, form.email, form.password)
      setUser(user)
      router.push('/dashboard')
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
          <h1 className="text-2xl font-bold mb-1">Mulai Perjalananmu</h1>
          <p className="text-slate-400 text-sm">Buat akun gratis dalam 30 detik</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Username</label>
              <input className="form-input" type="text" placeholder="username_kamu"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input className="form-input" type="email" placeholder="kamu@email.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 karakter"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Membuat akun...' : 'Buat Akun'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-4">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-brand-purple hover:text-violet-400">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
