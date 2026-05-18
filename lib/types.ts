export type EmotionType =
  | 'anxiety' | 'sadness' | 'joy' | 'anger' | 'calm'
  | 'fear' | 'overwhelmed' | 'hope' | 'loneliness' | 'gratitude'

export type StylePreset =
  | 'cosmic' | 'watercolor' | 'abstract' | 'light'
  | 'minimalist' | 'surreal' | 'nature' | 'geometric'

export interface EmotionLog {
  id: string
  emotion_type: EmotionType
  intensity: number
  description?: string
  ai_analysis?: string
  micro_habit?: string
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

export interface Artwork {
  id: string
  emotion_type: EmotionType
  style_preset: StylePreset
  prompt_text: string
  image_url: string
  colors: string[]
  created_at: string
}

export interface User {
  id: string
  username: string
  email: string
  display_name?: string
}

export interface AnalyzeResponse {
  analysis: string
  micro_habit: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  crisis_resources?: string[]
  art_prompt: string
  colors: string[]
  mood_score: number
}

export const EMOTIONS: { value: EmotionType; label: string; emoji: string; gradient: string }[] = [
  { value: 'anxiety',     label: 'Anxiety',     emoji: '😰', gradient: 'from-yellow-500 to-orange-500' },
  { value: 'sadness',     label: 'Sadness',     emoji: '😢', gradient: 'from-blue-500 to-indigo-600' },
  { value: 'joy',         label: 'Joy',         emoji: '😊', gradient: 'from-yellow-400 to-amber-400' },
  { value: 'anger',       label: 'Anger',       emoji: '😠', gradient: 'from-red-500 to-red-700' },
  { value: 'calm',        label: 'Calm',        emoji: '😌', gradient: 'from-emerald-400 to-teal-500' },
  { value: 'fear',        label: 'Fear',        emoji: '😨', gradient: 'from-violet-500 to-purple-700' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😩', gradient: 'from-gray-500 to-slate-600' },
  { value: 'hope',        label: 'Hope',        emoji: '🌟', gradient: 'from-pink-400 to-rose-500' },
  { value: 'loneliness',  label: 'Loneliness',  emoji: '🌑', gradient: 'from-indigo-500 to-blue-700' },
  { value: 'gratitude',   label: 'Gratitude',   emoji: '🙏', gradient: 'from-amber-400 to-orange-500' },
]

export const STYLES: { value: StylePreset; label: string; emoji: string }[] = [
  { value: 'cosmic',      label: 'Cosmic Dreams',    emoji: '🌌' },
  { value: 'watercolor',  label: 'Watercolor Flow',  emoji: '💧' },
  { value: 'abstract',    label: 'Abstract Emosi',   emoji: '🎨' },
  { value: 'light',       label: 'Light & Hope',     emoji: '✨' },
  { value: 'minimalist',  label: 'Minimalist Zen',   emoji: '⚪' },
  { value: 'surreal',     label: 'Surreal Dream',    emoji: '🌀' },
  { value: 'nature',      label: 'Organic Nature',   emoji: '🌿' },
  { value: 'geometric',   label: 'Geometric',        emoji: '🔷' },
]

export const EMOTION_BG: Record<EmotionType, string> = {
  anxiety:     'from-yellow-600 via-orange-600 to-red-700',
  sadness:     'from-blue-900 via-blue-600 to-indigo-700',
  joy:         'from-yellow-400 via-amber-400 to-orange-300',
  anger:       'from-red-900 via-red-600 to-orange-700',
  calm:        'from-emerald-900 via-teal-600 to-cyan-700',
  fear:        'from-purple-950 via-violet-700 to-purple-800',
  overwhelmed: 'from-gray-700 via-slate-600 to-zinc-800',
  hope:        'from-pink-700 via-rose-500 to-amber-400',
  loneliness:  'from-indigo-900 via-blue-700 to-slate-800',
  gratitude:   'from-amber-700 via-orange-500 to-yellow-400',
}
