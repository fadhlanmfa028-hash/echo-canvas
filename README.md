# EchoCanvas 🎨

AI Mental Health Art Platform — ubah emosimu jadi mahakarya visual.

---

## Deploy ke Vercel (5 menit)

### 1. Persiapan

Pastikan sudah install:
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)
- Akun [GitHub](https://github.com) (gratis)
- Akun [Vercel](https://vercel.com) (gratis)
- API Key dari [Anthropic Console](https://console.anthropic.com)

---

### 2. Upload ke GitHub

```bash
# Extract zip ini, masuk ke folder echocanvas
cd echocanvas

# Init git
git init
git add .
git commit -m "Initial commit: EchoCanvas"

# Buat repo baru di github.com lalu push
git remote add origin https://github.com/USERNAME/echocanvas.git
git branch -M main
git push -u origin main
```

---

### 3. Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih repo `echocanvas` yang baru kamu push
4. Di bagian **"Environment Variables"**, tambahkan:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (dari console.anthropic.com) |
| `JWT_SECRET` | string random panjang (bisa pakai [random.org](https://www.random.org/strings/)) |
| `NEXT_PUBLIC_APP_URL` | biarkan kosong dulu, isi setelah deploy |

5. Klik **Deploy** — selesai! 🎉

---

### 4. Setelah Deploy

Setelah dapat URL (misal `echocanvas-xxx.vercel.app`):
1. Buka Vercel → Settings → Environment Variables
2. Tambah `NEXT_PUBLIC_APP_URL` = `https://echocanvas-xxx.vercel.app`
3. Klik **Redeploy**

---

## Development Lokal

```bash
# Install dependencies
npm install

# Copy env
cp .env.local.example .env.local
# Edit .env.local, isi ANTHROPIC_API_KEY

# Jalankan dev server
npm run dev
# Buka http://localhost:3000
```

---

## Struktur Project

```
echocanvas/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── api/
│   │   ├── analyze/route.ts  # Claude AI: analisis emosi
│   │   └── generate/route.ts # Generate SVG artwork
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── create/page.tsx       # Halaman utama buat artwork
│   ├── gallery/page.tsx
│   ├── journey/page.tsx
│   └── settings/page.tsx
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── types.ts              # TypeScript types
│   └── auth.ts               # Auth helpers
├── stores/
│   └── useStore.ts           # Zustand global state
├── .env.local.example
├── vercel.json
└── README.md
```

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Styling**: Tailwind CSS
- **State**: Zustand (persisted ke localStorage)
- **Deploy**: Vercel

---

## Upgrade ke Production

Untuk production serius, pertimbangkan:
- **Database**: Supabase / PlanetScale untuk simpan data user
- **Auth**: NextAuth.js dengan email/Google login
- **Image Gen**: Replicate API (Stable Diffusion) untuk artwork yang lebih nyata
- **Payments**: Stripe untuk plan premium
- **Analytics**: Vercel Analytics / Mixpanel

---

Built with ❤️ for mental health awareness Indonesia.
