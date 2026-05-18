import { NextRequest, NextResponse } from 'next/server'

// NOTE: Untuk production dengan image generation sesungguhnya,
// ganti fungsi ini dengan call ke Replicate / DALL-E / Stable Diffusion API.
// Saat ini menggunakan SVG art generation yang deterministik dan gratis.

function generateSVGArt(
  emotion: string,
  colors: string[],
  prompt: string,
  style: string
): string {
  const c1 = colors[0] || '#8B5CF6'
  const c2 = colors[1] || '#6366F1'
  const c3 = colors[2] || '#EC4899'

  const seed = emotion.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = (n: number) => ((seed * 9301 + n * 49297) % 233280) / 233280

  const shapes = Array.from({ length: 12 }, (_, i) => {
    const cx = Math.round(rng(i * 7) * 800)
    const cy = Math.round(rng(i * 13) * 800)
    const r  = Math.round(rng(i * 3) * 200 + 40)
    const op = (rng(i * 17) * 0.5 + 0.1).toFixed(2)
    const color = [c1, c2, c3][i % 3]
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${op}"/>`
  })

  const lines = Array.from({ length: 6 }, (_, i) => {
    const x1 = Math.round(rng(i * 5) * 800)
    const y1 = Math.round(rng(i * 11) * 800)
    const x2 = Math.round(rng(i * 19) * 800)
    const y2 = Math.round(rng(i * 23) * 800)
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c2}" stroke-width="${Math.round(rng(i)*3+1)}" opacity="0.3"/>`
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="#0F172A"/>
  <rect width="800" height="800" fill="url(#bg)"/>
  <g filter="url(#blur)">
    ${shapes.join('\n    ')}
  </g>
  ${lines.join('\n  ')}
  <text x="400" y="760" text-anchor="middle" fill="${c1}" opacity="0.4" font-size="11" font-family="monospace">${style} • ${emotion}</text>
</svg>`

  // Return sebagai data URL
  const encoded = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${encoded}`
}

export async function POST(req: NextRequest) {
  try {
    const { emotion_type, style_preset, colors, art_prompt } = await req.json()

    const imageUrl = generateSVGArt(
      emotion_type || 'calm',
      colors || ['#8B5CF6', '#6366F1', '#EC4899'],
      art_prompt || '',
      style_preset || 'cosmic'
    )

    return NextResponse.json({
      id: crypto.randomUUID(),
      image_url: imageUrl,
      emotion_type,
      style_preset,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Gagal generate artwork' }, { status: 500 })
  }
}
