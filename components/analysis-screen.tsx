"use client"

import { useMemo } from "react"
import { ChevronLeft, Check, Sparkles, Stethoscope, Scan, MessageCircle } from "lucide-react"
import type { ClinicConfig, QuizAnswers } from "@/lib/types"
import { CONDITION_DESCRIPTIONS, URGENCY_MESSAGES } from "@/lib/constants"

interface AnalysisScreenProps {
  answers: QuizAnswers
  clinic: ClinicConfig
  onOpenModal: () => void
  onBack: () => void
}

export function AnalysisScreen({
  answers,
  clinic,
  onOpenModal,
  onBack,
}: AnalysisScreenProps) {
  const ordinaryPrice = clinic.ordinaryPrice || "1 590 kr"
  const monthlyFromPrice = clinic.monthlyFromPrice || "300 kr"
  // Generate personalized analysis bullets based on answers
  const bullets = useMemo(() => {
    const result: string[] = []

    // Condition
    const conditionText =
      CONDITION_DESCRIPTIONS[answers.condition] || "din tandsituation"
    result.push(
      `Du beskriver <b>${conditionText}</b> – en situation där tandimplantat ofta är ett hållbart alternativ.`
    )

    // Eating
    if (answers.eating && answers.eating !== "fine") {
      result.push(
        `Du har märkt att <b>tuggandet påverkas</b> i vardagen. Fast förankrade tänder gör det lättare att äta som vanligt igen.`
      )
    }

    // Confidence
    if (answers.confidence === "often" || answers.confidence === "sometimes") {
      result.push(
        `Du nämner att det <b>påverkar hur du känner dig socialt</b> – många får tillbaka självförtroendet med ett fast leende.`
      )
    }

    // Roadblock-specific messages
    if (answers.roadblock === "cost") {
      result.push(
        `Eftersom <b>kostnaden</b> varit ett hinder: du kan delbetala räntefritt och ofta använda högkostnadsskyddet.`
      )
    }
    if (answers.roadblock === "fear") {
      result.push(
        `Känner du <b>oro</b> inför tandvård? Vi tar det i din takt och kan söva oroliga patienter.`
      )
    }
    if (answers.roadblock === "time") {
      result.push(
        `Vi planerar behandlingen så <b>smidigt som möjligt</b> och berättar tidsåtgången redan på konsultationen.`
      )
    }
    if (answers.roadblock === "trust") {
      result.push(
        `Du får träffa <b>specialister på implantat</b> som tar sig tid – så att du känner dig trygg.`
      )
    }

    // Payment
    if (answers.payment === "yes" && answers.income === "yes") {
      result.push(
        `Du är öppen för delbetalning och har en inkomst – goda förutsättningar för en <b>räntefri betalplan från ${monthlyFromPrice}/mån</b>.`
      )
    }
    if (answers.payment === "yes" && answers.income === "no") {
      result.push(
        `Vi går igenom vilka <b>betalningsalternativ</b> som passar just dig på konsultationen.`
      )
    }

    return result
  }, [answers, monthlyFromPrice])

  // Get urgency-based next step message
  const urgencyMessage = URGENCY_MESSAGES[answers.urgency] || ""

  return (
    <div className="max-w-[680px] mx-auto bg-surface border border-border rounded-[var(--r)] overflow-hidden p-5 md:p-7" style={{ boxShadow: "var(--shadow-lg)" }}>
      <div className="stagger">
        {/* Seal icon */}
        <div className="w-[62px] h-[62px] rounded-full bg-coral-soft flex items-center justify-center text-coral-deep mb-4 shadow-[0_0_0_8px_#fff5f1] animate-pop">
          <Sparkles className="w-[26px] h-[26px]" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-semibold text-[clamp(25px,5vw,33px)] text-ink">
          Din personliga analys är klar
        </h1>

        {/* Lead */}
        <p className="text-muted text-base mt-2.5">
          Utifrån dina svar har vi tagit fram en rekommendation för just din
          situation.
        </p>

        {/* Recommendation card */}
        <div className="mt-5 border border-border rounded-[var(--r-sm)] overflow-hidden">
          <div className="bg-gradient-to-b from-[#FFF7EF] to-[#FFEFE7] px-4 py-4 border-b border-border">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-coral-deep">
              Vår rekommendation
            </div>
            <div className="font-display font-semibold text-[19px] mt-1">
              Tandimplantat kan vara rätt för dig
            </div>
          </div>
          <ul className="list-none p-4 grid gap-3">
            {bullets.map((bullet, index) => (
              <li
                key={index}
                className="flex gap-3 items-start text-[14.5px] text-ink"
              >
                <Check className="flex-shrink-0 w-[17px] h-[17px] text-green mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: bullet }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Urgency/next step message */}
        {urgencyMessage && (
          <div className="mt-4 border border-[#D7EEE1] bg-green-soft rounded-[var(--r-sm)] p-3 flex gap-3 items-start">
            <div className="flex-shrink-0 text-green">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10.5px] font-bold tracking-[0.1em] uppercase text-green mb-0.5">
                Nästa steg
              </div>
              <div className="text-[13.5px] text-[#3c6b52] leading-[1.45]">
                {urgencyMessage}
              </div>
            </div>
          </div>
        )}

        {/* Offer box */}
        <div className="mt-5 text-center bg-ink text-white rounded-[var(--r-sm)] py-6 px-5">
          <div className="mb-5 inline-flex flex-col gap-2 text-left">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#B7ACA0]">
              Detta ingår
            </div>
            <ul className="grid gap-1.5">
              <li className="flex items-center gap-2 text-[14.5px] text-[#E7DFD4]">
                <Stethoscope className="w-[16px] h-[16px] text-gold flex-shrink-0" />
                Undersökning
              </li>
              <li className="flex items-center gap-2 text-[14.5px] text-[#E7DFD4]">
                <Scan className="w-[16px] h-[16px] text-gold flex-shrink-0" />
                Röntgenbilder
              </li>
              <li className="flex items-center gap-2 text-[14.5px] text-[#E7DFD4]">
                <MessageCircle className="w-[16px] h-[16px] text-gold flex-shrink-0" />
                Konsultation
              </li>
            </ul>
          </div>
          <div className="font-display font-semibold text-[15px] text-[#E7DFD4]">
            <s className="text-muted-2" style={{ textDecorationThickness: "2px" }}>
              Ordinarie pris {ordinaryPrice}
            </s>{" "}
            &nbsp;&rarr;&nbsp;{" "}
            <b className="text-white text-xl">0 kr idag</b>
          </div>
          <button
            onClick={onOpenModal}
            className="btn-gold py-4 px-7 text-[17px] mt-4"
          >
            Boka din kostnadsfria konsultation
          </button>
          <div className="mt-3 text-xs text-[#B7ACA0]">
            Gratis &amp; utan förbindelse
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-body text-[13.5px] font-semibold text-muted mt-5 py-1 px-0.5 transition-all duration-150 hover:text-ink hover:gap-2.5"
        >
          <ChevronLeft className="w-[15px] h-[15px]" />
          Ändra mina svar
        </button>
      </div>
    </div>
  )
}
