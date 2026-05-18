import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CRISIS_KEYWORDS = [
  'bunuh diri', 'mati', 'ingin mati', 'tidak ingin hidup', 'suicidal',
  'self-harm', 'menyakiti diri', 'sudah tidak kuat', 'hopeless berat',
  'tidak ada harapan', 'lebih baik mati',
]

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase()
  return CRISIS_KEYWORDS.some(k => lower.includes(k))
}

export async function POST(req: NextRequest) {
  try {
    const { emotion_type, intensity, description, style_preset } = await req.json()

    if (!emotion_type || !intensity) {
      return NextResponse.json({ error: 'emotion_type dan intensity wajib diisi' }, { status: 400 })
    }

    const hasCrisis = description ? detectCrisis(description) : false
    const riskLevel = hasCrisis ? 'critical' : intensity >= 8 ? 'high' : intensity >= 5 ? 'medium' : 'low'

    const systemPrompt = `Kamu adalah psikolog klinis dan seniman AI untuk platform EchoCanvas — platform mental health art untuk Gen-Z Indonesia.

Tugasmu: Analisis emosi user dan buat respons yang terapeutik, empatik, dan artistik.

ATURAN KETAT:
1. Selalu validasi emosi user — jangan pernah dismiss atau meremehkan
2. Jika risk_level = critical/high, WAJIB sertakan crisis_resources
3. Prompt seni HARUS: tidak ada gambar manusia yang menyakiti diri, tidak ada kekerasan eksplisit, fokus pada ekspresi abstrak/metaforik
4. Bahasa: campur Indonesia dan English natural (Gen-Z style) tapi tetap warm dan profesional
5. micro_habit: 1 tindakan kecil yang bisa dilakukan dalam 5 menit

Selalu respond dalam JSON valid sesuai schema.`

    const userMsg = `
Emosi: ${emotion_type}
Intensitas: ${intensity}/10
Deskripsi: ${description || '(tidak ada)'}
Gaya seni pilihan: ${style_preset || 'cosmic'}
Risk level terdeteksi: ${riskLevel}

Berikan respons JSON dengan format PERSIS:
{
  "analysis": "analisis empatik 2-3 kalimat dalam bahasa Indonesia, validasi perasaan mereka",
  "micro_habit": "1 micro-habit spesifik yang bisa dilakukan sekarang (max 20 kata)",
  "risk_level": "${riskLevel}",
  "crisis_resources": ${hasCrisis ? '["Into The Light Indonesia: 119 ext 8", "Yayasan Pulih: (021) 788-42580", "Kementerian Kesehatan: 1500-454"]' : 'null'},
  "art_prompt": "detailed artistic prompt dalam bahasa Inggris untuk menghasilkan abstract visual art yang mencerminkan emosi ini — deskripsikan warna, tekstur, komposisi, mood (max 80 kata, TANPA figure manusia, fokus abstrak/alam/kosmik)",
  "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "mood_score": ${10 - intensity + 1}
}

HANYA balas dengan JSON. Tidak ada teks lain.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMsg }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Analyze error:', err)
    // Fallback response jika API gagal
    return NextResponse.json({
      analysis: 'Terima kasih sudah berbagi perasaanmu. Setiap emosi yang kamu rasakan itu valid dan berharga.',
      micro_habit: 'Tarik napas dalam 4 hitungan, tahan 4, hembuskan 4. Ulangi 3x.',
      risk_level: 'low',
      crisis_resources: null,
      art_prompt: 'abstract cosmic nebula swirling with soft luminous colors, ethereal atmosphere, peaceful energy flowing through space',
      colors: ['#8B5CF6', '#6366F1', '#EC4899'],
      mood_score: 5,
    })
  }
}
