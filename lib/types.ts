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
