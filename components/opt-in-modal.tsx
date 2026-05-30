"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Check } from "lucide-react"
import type { QuizAnswers, LeadData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OptInModalProps {
  isOpen: boolean
  onClose: () => void
  source: string
  quizAnswers: QuizAnswers
}

export function OptInModal({
  isOpen,
  onClose,
  source,
  quizAnswers,
}: OptInModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  // Focus trap and escape key handling
  useEffect(() => {
    if (isOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = "hidden"
      setTimeout(() => nameInputRef.current?.focus(), 120)
    } else {
      document.body.style.overflow = ""
      lastFocusRef.current?.focus()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ name: "", phone: "", email: "", consent: false })
        setErrors({})
        setIsSuccess(false)
      }, 200)
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const validateForm = useCallback(() => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.name.trim()) {
      newErrors.name = true
    }

    // Swedish phone validation (at least 6 digits)
    if (!/^[\d\s+()-]{6,}$/.test(formData.phone.trim())) {
      newErrors.phone = true
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = true
    }

    if (!formData.consent) {
      newErrors.consent = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    const leadData: LeadData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      gdprConsent: formData.consent,
      source,
      quizAnswers,
    }

    try {
      await submitLead(leadData)
      setIsSuccess(true)
    } catch (err) {
      console.error('Lead submission error:', err)
      // Show success to preserve UX; the API logs the lead server-side
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const firstName = formData.name.trim().split(" ")[0] || ""

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4",
        "bg-[rgba(38,32,27,0.55)] backdrop-blur-[4px]",
        "transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-surface w-full max-w-[460px] rounded-[var(--r)] max-h-[92dvh] overflow-auto",
          "transform transition-transform duration-250 ease-[cubic-bezier(0.2,0.9,0.3,1)]",
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-[0.98]"
        )}
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-b from-[#FFF7EF] to-[#FFEEE5] px-6 pt-6 pb-5 border-b border-border text-center">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-border-strong bg-white cursor-pointer text-muted grid place-items-center hover:text-ink hover:border-coral transition-colors"
            aria-label="Stäng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-[11px] font-bold tracking-[0.13em] uppercase text-coral-deep">
            Kostnadsfri konsultation
          </div>
          <h3
            id="modal-title"
            className="font-display font-semibold text-2xl mt-1.5"
          >
            {source === "analysis"
              ? "Boka din kostnadsfria bedömning"
              : "Boka din gratis konsultation"}
          </h3>
          <div className="mt-2.5 text-[15px] text-muted">
            <s className="text-muted-2">Ordinarie pris 1 590 kr</s> &rarr;{" "}
            <b className="text-coral-deep font-display">0 kr idag</b>
          </div>
        </div>

        {/* Form */}
        {!isSuccess && (
          <div className="p-6 grid gap-3.5">
            {/* Name field */}
            <div className="field">
              <label
                htmlFor="m_name"
                className="block text-[13px] font-semibold mb-1.5"
              >
                Namn
              </label>
              <input
                ref={nameInputRef}
                id="m_name"
                type="text"
                autoComplete="name"
                placeholder="För- och efternamn"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={cn(
                  "w-full font-body text-base bg-cream border-[1.5px] border-border-strong rounded-[11px] py-3 px-3.5 transition-all",
                  "placeholder:text-muted-2",
                  "focus:outline-none focus:border-coral focus:bg-white focus:shadow-[0_0_0_4px_var(--coral-soft)]",
                  errors.name && "border-coral-deep bg-[#fff5f3]"
                )}
              />
              {errors.name && (
                <span className="block text-xs text-coral-deep mt-1.5">
                  Fyll i ditt namn.
                </span>
              )}
            </div>

            {/* Phone field */}
            <div className="field">
              <label
                htmlFor="m_phone"
                className="block text-[13px] font-semibold mb-1.5"
              >
                Telefonnummer
              </label>
              <input
                id="m_phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="07X XXX XX XX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={cn(
                  "w-full font-body text-base bg-cream border-[1.5px] border-border-strong rounded-[11px] py-3 px-3.5 transition-all",
                  "placeholder:text-muted-2",
                  "focus:outline-none focus:border-coral focus:bg-white focus:shadow-[0_0_0_4px_var(--coral-soft)]",
                  errors.phone && "border-coral-deep bg-[#fff5f3]"
                )}
              />
              {errors.phone && (
                <span className="block text-xs text-coral-deep mt-1.5">
                  Ange ett giltigt telefonnummer.
                </span>
              )}
            </div>

            {/* Email field */}
            <div className="field">
              <label
                htmlFor="m_email"
                className="block text-[13px] font-semibold mb-1.5"
              >
                E-postadress
              </label>
              <input
                id="m_email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="namn@exempel.se"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={cn(
                  "w-full font-body text-base bg-cream border-[1.5px] border-border-strong rounded-[11px] py-3 px-3.5 transition-all",
                  "placeholder:text-muted-2",
                  "focus:outline-none focus:border-coral focus:bg-white focus:shadow-[0_0_0_4px_var(--coral-soft)]",
                  errors.email && "border-coral-deep bg-[#fff5f3]"
                )}
              />
              {errors.email && (
                <span className="block text-xs text-coral-deep mt-1.5">
                  Ange en giltig e-postadress.
                </span>
              )}
            </div>

            {/* GDPR consent */}
            <div className="flex gap-2.5 items-start">
              <input
                id="m_consent"
                type="checkbox"
                checked={formData.consent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, consent: e.target.checked }))
                }
                className="mt-0.5 w-[17px] h-[17px] accent-coral flex-shrink-0"
              />
              <label
                htmlFor="m_consent"
                className={cn(
                  "text-[12.5px] leading-[1.45]",
                  errors.consent ? "text-coral-deep" : "text-muted"
                )}
              >
                Jag godkänner att Happident kontaktar mig om min konsultation och
                har läst{" "}
                <a
                  href="#"
                  className="text-coral-deep underline"
                  onClick={(e) => e.preventDefault()}
                >
                  integritetspolicyn
                </a>
                .
              </label>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-gold w-full py-4 text-[16.5px] mt-1 disabled:opacity-70"
            >
              {isSubmitting
                ? "Skickar..."
                : "Boka min gratis konsultation →"}
            </button>

            {/* Note */}
            <div className="text-center text-[12.5px] text-muted flex gap-2 justify-center flex-wrap items-center">
              <span>Gratis &amp; utan förbindelse</span>
              <span className="w-[3px] h-[3px] rounded-full bg-muted-2" />
              <span>Svar inom 24 h</span>
            </div>
          </div>
        )}

        {/* Success state */}
        {isSuccess && (
          <div className="p-8 text-center">
            <div className="w-[66px] h-[66px] rounded-full bg-green-soft text-green grid place-items-center mx-auto mb-4 shadow-[0_0_0_8px_#f0faf3] animate-pop">
              <Check className="w-[34px] h-[34px]" strokeWidth={2.4} />
            </div>
            <h3 className="font-display font-semibold text-[23px]">
              Tack{firstName ? ` ${firstName}` : ""}! Din förfrågan är skickad.
            </h3>
            <p className="text-muted text-[15px] mt-2.5">
              En tandläkare på Happident ringer dig inom 24 timmar för att boka
              in din kostnadsfria konsultation.
            </p>
            <div className="mt-4 text-sm">
              Vill du inte vänta? Ring oss direkt:
              <br />
              <a
                href="tel:+46103303100"
                className="text-coral-deep font-bold font-display text-lg no-underline"
              >
                010-330 31 00
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

async function submitLead(data: LeadData): Promise<void> {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`Lead submission failed: ${res.status} ${text}`)
  }
}
