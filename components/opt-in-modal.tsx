"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, CalendarClock, ShieldAlert } from "lucide-react"
import type { QuizAnswers, LeadData, ClinicConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

type ModalStep = "form" | "booking"

interface OptInModalProps {
  isOpen: boolean
  onClose: () => void
  source: string
  quizAnswers: QuizAnswers
  clinic: ClinicConfig
  campaign: string
}

export function OptInModal({
  isOpen,
  onClose,
  source,
  quizAnswers,
  clinic,
  campaign,
}: OptInModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [step, setStep] = useState<ModalStep>("form")
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
        setStep("form")
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
      clinic: clinic.slug,
      campaign,
    }

    // Fire FB Lead event as soon as the form is submitted
    if (typeof window !== 'undefined' && typeof (window as unknown as { fbq?: unknown }).fbq === 'function') {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead')
    }

    try {
      await submitLead(leadData)
    } catch (err) {
      console.error('Lead submission error:', err)
      // Still advance to booking; the API logs the lead server-side
    } finally {
      setIsSubmitting(false)
      setStep("booking")
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
          "bg-surface w-full rounded-[var(--r)] max-h-[94dvh] overflow-auto transition-[max-width] duration-200",
          step === "booking" ? "max-w-[600px]" : "max-w-[460px]",
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
            {step === "form" ? "Kostnadsfri konsultation" : "Sista steget"}
          </div>
          <h3
            id="modal-title"
            className="font-display font-semibold text-2xl mt-1.5"
          >
            {step === "form"
              ? source === "analysis"
                ? "Boka din kostnadsfria bedömning"
                : "Boka din gratis konsultation"
              : `Välj en tid${firstName ? `, ${firstName}` : ""}`}
          </h3>
          {step === "form" ? (
            <div className="mt-2.5 text-[15px] text-muted">
              <s className="text-muted-2">Ordinarie pris {clinic.ordinaryPrice || "1 590 kr"}</s> &rarr;{" "}
              <b className="text-coral-deep font-display">0 kr idag</b>
            </div>
          ) : (
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-coral-deep">
              <ShieldAlert className="w-[16px] h-[16px] flex-shrink-0" />
              Din plats är inte bokad ännu
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[10.5px] font-bold tracking-[0.12em] uppercase text-muted">
                Steg {step === "form" ? 1 : 2} av 2
              </span>
              <span className="font-display font-semibold text-[12.5px] text-coral-deep">
                {step === "form" ? 50 : 100}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-cream-2 overflow-hidden">
              <div
                className="h-full rounded-full progress-fill transition-[width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ width: step === "form" ? "50%" : "100%" }}
                role="progressbar"
                aria-valuenow={step === "form" ? 50 : 100}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        {step === "form" && (
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
                Jag godkänner att {clinic.name} kontaktar mig om min konsultation och
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
            <div className="text-center text-[12.5px] text-muted">
              Inga dolda avgifter och helt kravfritt.
            </div>
          </div>
        )}

        {/* Booking step */}
        {step === "booking" && (
          <div className="p-6">
            {clinic.bookingWidgetUrl ? (
              <VardenBookingTrigger url={clinic.bookingWidgetUrl} firstName={firstName} />
            ) : (
              <div className="text-center py-3">
                <h3 className="font-display font-semibold text-[21px]">
                  Tack{firstName ? ` ${firstName}` : ""}! Din förfrågan är skickad.
                </h3>
                <p className="text-muted text-[15px] mt-2.5">
                  Vi på {clinic.name} kontaktar dig inom 24 timmar för att boka
                  in din kostnadsfria konsultation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Varden native widget trigger ────────────────────────────────────────────
// Injects Varden's own script into the top-level page context so BankID works.
// This replicates exactly what happident.se does — their widgetModalMulti.js
// creates the modal and iframe itself, so deeplinks and popups are unrestricted.

function VardenBookingTrigger({ url, firstName }: { url: string; firstName: string }) {
  const [opened, setOpened] = useState(false)

  const openWidget = useCallback(() => {
    let widgetId = 'w181'
    try {
      widgetId = new URL(url).searchParams.get('widgetId') ?? 'w181'
    } catch {}
    const dataId = `${widgetId}-`

    // Inject Varden CSS once
    if (!document.getElementById('widget-modal-style')) {
      const link = document.createElement('link')
      link.id = 'widget-modal-style'
      link.rel = 'stylesheet'
      link.href = 'https://www.varden.se/booking-widget/widgetModalMulti.css'
      document.head.appendChild(link)
    }

    // Inject backdrop + modal divs once
    if (!document.querySelector(`.vardenWidgetModal[data-widget-id="${dataId}"]`)) {
      const backdrop = document.createElement('div')
      backdrop.className = 'vardenWidgetBackdrop varden-widget-hidden'
      backdrop.setAttribute('data-widget-id', dataId)
      document.body.appendChild(backdrop)

      const modal = document.createElement('div')
      modal.className = 'vardenWidgetModal varden-widget-hidden'
      modal.setAttribute('data-widget-id', dataId)

      const content = document.createElement('div')
      content.className = 'vardenWidgetModalContent'
      content.setAttribute('data-widget-id', dataId)
      content.setAttribute('src', url)
      modal.appendChild(content)
      document.body.appendChild(modal)
    }

    const triggerOpen = () => {
      const btn = document.createElement('button')
      btn.setAttribute('data-widget-id', dataId)
      btn.className = 'openVardenWidgetModalBtn'
      btn.style.cssText = 'position:fixed;top:-9999px;left:-9999px;'
      document.body.appendChild(btn)
      btn.click()
      setTimeout(() => btn.remove(), 200)
      setOpened(true)
    }

    // Inject script (once); auto-trigger after load
    if (!document.getElementById('widget-modal-script')) {
      const script = document.createElement('script')
      script.id = 'widget-modal-script'
      script.src = 'https://www.varden.se/booking-widget/widgetModalMulti.js'
      script.onload = triggerOpen
      document.body.appendChild(script)
    } else {
      triggerOpen()
    }
  }, [url])

  return (
    <div className="text-center grid gap-4">
      <div>
        <h3 className="font-display font-semibold text-[21px]">
          Tack{firstName ? `, ${firstName}` : ""}! Ett sista steg.
        </h3>
        <p className="text-muted text-[15px] mt-2">
          Din förfrågan är mottagen. Välj en tid i kalendern för att säkra din plats.
        </p>
      </div>
      <button
        onClick={openWidget}
        className="btn-gold w-full py-4 text-[16.5px]"
      >
        {opened ? "Kalendern är öppen ↗" : "Välj din tid i kalendern →"}
      </button>
      {opened && (
        <p className="text-[12.5px] text-muted">
          Bokningskalendern öppnades. Stäng detta fönster om du är klar.
        </p>
      )}
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
