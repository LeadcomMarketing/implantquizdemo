"use client"

import type { ClinicConfig, QuizPhase } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  clinic: ClinicConfig
  phase: QuizPhase
  onOpenModal: () => void
}

export function SiteHeader({ clinic, phase, onOpenModal }: SiteHeaderProps) {
  const showFullHeader = phase === "analysis"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border",
        "bg-[rgba(250,244,234,0.86)] backdrop-blur-[10px] backdrop-saturate-[140%]"
      )}
    >
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2.5 gap-2">
          {/* Left spacer (balances the CTA column so the logo stays centered) */}
          <div />

          {/* Logo + city, centered */}
          <a
            href="#"
            className="flex flex-col items-center gap-0.5"
            aria-label={clinic.name}
          >
            <img
              src={clinic.logoUrl}
              alt={clinic.name}
              className="h-[26px] md:h-[30px] w-auto"
            />
            {clinic.city && (
              <span className="text-[11px] md:text-[11.5px] font-bold tracking-[0.14em] uppercase text-coral-deep">
                {clinic.city}
              </span>
            )}
          </a>

          {/* Right side - only visible in Phase 2 */}
          <div
            className={cn(
              "flex items-center justify-end gap-3.5 transition-opacity duration-300",
              showFullHeader ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* CTA Button */}
            <button
              onClick={onOpenModal}
              className="btn-gold py-2.5 px-4 md:py-3 md:px-5 text-sm md:text-[15px]"
            >
              Boka konsultation
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
