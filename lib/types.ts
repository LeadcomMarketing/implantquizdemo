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
  campaign: string
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
  /** Struck-through "ordinarie pris" shown before the free-consultation offer, e.g. "1 590 kr". Falls back to "1 590 kr". */
  ordinaryPrice?: string
  /** Lowest monthly financing price advertised, e.g. "300 kr". Falls back to "300 kr". */
  monthlyFromPrice?: string
  /** Opening hours shown in the clinic/visit section, e.g. "Mån–Fre 08–17". */
  openingHours?: string
  /** Swedish organisationsnummer, shown in the footer if set. */
  orgNumber?: string
  /** City name shown under the logo in the header, e.g. "Göteborg". */
  city?: string
  /** Google rating shown in the trust badge under the quiz, e.g. 4.7. Falls back to 4.7. */
  googleRating?: number
  /** Whether to show the Google rating trust badge at all. Defaults to true. */
  showGoogleRating?: boolean
  /**
   * Iframe src URL for this clinic's Varden booking widget (step 2 of the
   * opt-in modal). Extracted from the `src` attribute on the
   * `.vardenWidgetModalContent` div in Varden's embed snippet — not the
   * whole snippet. Omit to skip the calendar step.
   */
  bookingWidgetUrl?: string
}
