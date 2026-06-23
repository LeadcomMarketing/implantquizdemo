// Quiz Types
export type QuestionType = "image" | "text"

export interface QuizOption {
  value: string
  label: string
  illustration?: "single" | "multi" | "denture" | "most"
}

export interface QuizQuestion {
  id: string
  eyebrow: string
  type: QuestionType
  question: string
  subtext?: string
  options: QuizOption[]
  why?: string
  reassure?: string
  conditionalOn?: {
    questionId: string
    value: string
  }
}

export interface QuizAnswers {
  [questionId: string]: string
}

export type QuizPhase = "quiz" | "analysis"

export interface QuizState {
  currentQuestionId: string
  answers: QuizAnswers
  phase: QuizPhase
}

// Lead Data
export interface LeadData {
  name: string
  phone: string
  email: string
  gdprConsent: boolean
  source: string
  quizAnswers: QuizAnswers
  clinic: string
}

// Pricing Data
export interface PricingCard {
  name: string
  description: string
  monthlyPrice: string
  totalPrice: string
}

// FAQ Data
export interface FAQItem {
  question: string
  answer: string
}

// Testimonial Data
export interface Testimonial {
  stars: number
  quote: string
  name: string
  location: string
}

// Step Data
export interface ProcessStep {
  number: number
  title: string
  description: string
}

// Reason Data
export interface Reason {
  title: string
  description: string
  iconType: "shield" | "check" | "star" | "checkmark"
}

// Clinic Data — per-clinic theming, branding, reviews and lead routing

export interface ClinicTheme {
  coral?: string
  coralDeep?: string
  coralSoft?: string
  gold?: string
  goldDeep?: string
  goldSoft?: string
}

export interface ClinicReview {
  stars: number
  quote: string
  name: string
  location: string
}

export interface ClinicConfig {
  /** URL slug — used as /c/[slug] */
  slug: string
  name: string
  /** Path or absolute URL to a logo image (rendered with a plain <img>) */
  logoUrl: string
  /** Display phone, e.g. "010-330 31 00" */
  phone: string
  /** tel: URI value, e.g. "+46103303100" */
  phoneTel: string
  email: string
  address: string
  mapEmbedSrc: string
  /** Partial brand color override. Omitted keys fall back to the default theme. */
  theme?: ClinicTheme
  /** Override the default testimonials with this clinic's own reviews. */
  reviews?: ClinicReview[]
  /** Where this clinic's leads get forwarded server-side. Falls back to LEAD_WEBHOOK_URL env. */
  webhookUrl?: string
}
