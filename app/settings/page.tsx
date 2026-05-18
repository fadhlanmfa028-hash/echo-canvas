'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/stores/useStore'
import Navbar from '@/components/Navbar'
import { User, Shield, Trash2, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useStore()
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (!isAuthenticated) router.push('/auth/login') }, [isAuthenticated, router])

  const handleLogout = () => { logout(); router.push('/') }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Pengaturan</h1>
          <p className="text-slate-400 text-sm">Kelola profil dan preferensi kamu</p>
        </div>

        {/* Profile */}
        <div className="card mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{user.display_name || user.username}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Display Name</label>
              <input className="form-input" defaultValue={user.display_name || user.username} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email</label>
              <input className="form-input" defaultValue={user.email} disabled />
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary mt-4 px-5 py-2 text-sm">
            {saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Privacy */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-brand-purple" />
            <h2 className="font-semibold text-sm">Privasi</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Visibility karya default</p>
                <p className="text-xs text-slate-500">Siapa yang bisa melihat artworkmu</p>
              </div>
              <select className="form-input w-auto text-sm px-3 py-1.5">
                <option>Privat</option>
                <option>Publik</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Notifikasi harian</p>
                <p className="text-xs text-slate-500">Pengingat untuk log emosi</p>
              </div>
              <div className="w-10 h-5 rounded-full bg-brand-purple relative cursor-pointer">
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card border-red-500/20">
          <h2 className="font-semibold text-sm text-red-400 mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Zona Bahaya
          </h2>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:border-red-400/50 hover:text-red-400 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Keluar dari Akun
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
