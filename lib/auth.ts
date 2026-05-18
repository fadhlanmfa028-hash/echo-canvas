import { User } from './types'

const STORAGE_KEY = 'echocanvas_user'
const LOGS_KEY = 'echocanvas_logs'
const ARTWORKS_KEY = 'echocanvas_artworks'

// Simple client-side auth (for demo/MVP — swap with NextAuth or Supabase for production)
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function setUser(user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export function register(username: string, email: string, _password: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    display_name: username,
  }
  setUser(user)
  return user
}

export function login(email: string, _password: string): User | null {
  // MVP: accept any credentials, create user from email
  const username = email.split('@')[0]
  const user: User = {
    id: 'user_' + btoa(email).slice(0, 8),
    username,
    email,
    display_name: username,
  }
  setUser(user)
  return user
}

// Local storage for emotion logs & artworks (MVP — replace with DB calls)
export function getLogs() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]') } catch { return [] }
}

export function addLog(log: object) {
  const logs = getLogs()
  logs.unshift(log)
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 100)))
}

export function getArtworks() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(ARTWORKS_KEY) || '[]') } catch { return [] }
}

export function addArtwork(artwork: object) {
  const artworks = getArtworks()
  artworks.unshift(artwork)
  localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks.slice(0, 50)))
}
