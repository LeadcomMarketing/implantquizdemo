import type { QuizQuestion } from '@/lib/types'
import { QUIZ_QUESTIONS } from '@/lib/constants'

// ─── Hero copy ────────────────────────────────────────────────────────────────

export interface HeroCopy {
  eyebrow: string
  headline: string
  sub: string
}

// ─── Age-screening question (only injected for the 67 campaign) ───────────────

const AGE_GROUP_QUESTION: QuizQuestion = {
  id: 'age_group',
  eyebrow: 'Fråga 1',
  type: 'text',
  question: 'Hur gammal är du?',
  subtext: 'Tiotandvården ger dig rätt till ett statligt bidrag – vi vill säkerställa att du får rätt information.',
  options: [
    { value: 'under67', label: 'Under 67 år' },
    { value: 'turning67', label: 'Fyller 67 år i år' },
    { value: 'over67',   label: 'Över 67 år' },
  ],
  why: 'Tiotandvårdsreformen gäller dig som fyller 67 år eller äldre under innevarande år. Ditt svar avgör vilket stöd du kan få.',
}

// ─── Campaign definitions ─────────────────────────────────────────────────────

export interface Campaign {
  key: string
  hero: HeroCopy
  /** Full ordered question list the quiz will use */
  questions: QuizQuestion[]
}

// Re-number eyebrows so they always say "Fråga N av M" correctly.
// The quiz card itself handles the counter display, so eyebrow is cosmetic —
// we just keep the originals and let the card show the live index.
function withAgeQuestion(base: QuizQuestion[]): QuizQuestion[] {
  return [AGE_GROUP_QUESTION, ...base]
}

export const CAMPAIGNS: Record<string, Campaign> = {
  // ── Default: general implant campaign ──────────────────────────────────────
  general: {
    key: 'general',
    hero: {
      eyebrow: 'Gratis analys · tar 60 sekunder',
      headline: 'Ta reda på om tandimplantat är rätt för dig – och få ett fast pris från 300 kr/mån.',
      sub: '',
    },
    questions: QUIZ_QUESTIONS,
  },

  // ── ?v=67: Tiotandvården / 67+ campaign ────────────────────────────────────
  '67': {
    key: '67',
    hero: {
      eyebrow: 'Ny reform · Tiotandvården 2025',
      headline: 'Staten betalar upp till 90 % av ditt tandimplantat – om du är 67 eller äldre.',
      sub: 'Ta reda på vad du har rätt till. Gratis analys på 60 sekunder.',
    },
    questions: withAgeQuestion(QUIZ_QUESTIONS),
  },
}

export const DEFAULT_CAMPAIGN = CAMPAIGNS.general
