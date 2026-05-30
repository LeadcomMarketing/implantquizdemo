"use client"

import { Phone } from "lucide-react"
import Image from "next/image"
import type { QuizPhase } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  phase: QuizPhase
  onOpenModal: () => void
}

export function SiteHeader({ phase, onOpenModal }: SiteHeaderProps) {
  const showFullHeader = phase === "analysis"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border",
        "bg-[rgba(250,244,234,0.86)] backdrop-blur-[10px] backdrop-saturate-[140%]"
      )}
    >
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3 gap-3.5">
          {/* Logo */}
          <a href="#" className="flex items-center" aria-label="Happident">
            <Image
              src="/happident-logo.svg"
              alt="Happident"
              width={120}
              height={30}
              className="h-[26px] md:h-[30px] w-auto"
              priority
            />
          </a>

          {/* Right side - only visible in Phase 2 */}
          <div
            className={cn(
              "flex items-center gap-3.5 transition-opacity duration-300",
              showFullHeader ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Phone link */}
            <a
              href="tel:+46103303100"
              className="flex items-center gap-1.5 text-ink no-underline font-semibold text-[14.5px] whitespace-nowrap"
            >
              <Phone className="w-[17px] h-[17px] text-coral" />
              <span className="hidden sm:inline">010-330 31 00</span>
            </a>

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
