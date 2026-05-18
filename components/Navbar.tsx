'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, LayoutDashboard, Palette, Image, TrendingUp, Settings, LogOut } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { clsx } from 'clsx'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/create',    icon: Palette,         label: 'Buat' },
  { href: '/gallery',   icon: Image,            label: 'Galeri' },
  { href: '/journey',   icon: TrendingUp,       label: 'Perjalanan' },
  { href: '/settings',  icon: Settings,         label: 'Setelan' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-brand-dark/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-purple" />
          <span className="font-semibold text-base gradient-text">EchoCanvas</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            {NAV.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  pathname === href
                    ? 'bg-brand-purple/20 text-brand-purple'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn-secondary text-sm px-4 py-2">Masuk</Link>
            <Link href="/auth/register" className="btn-primary text-sm px-4 py-2">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
