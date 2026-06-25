"use client"

import {
  Phone,
  Check,
  Shield,
  Star,
  CheckCircle,
  Stethoscope,
  Scan,
  MessageCircle,
  ClipboardList,
  HandCoins,
} from "lucide-react"
import {
  PROCESS_STEPS,
  PRICING_CARDS,
  REASONS,
  TESTIMONIALS,
  FAQ_ITEMS,
} from "@/lib/constants"
import type { ClinicConfig } from "@/lib/types"
import { ProcessStepIllustration } from "./illustrations"
import { FAQAccordion } from "./faq-accordion"
import { GoogleRatingBadge } from "./google-rating-badge"

interface LandingPageProps {
  clinic: ClinicConfig
  onOpenModal: (source: string) => void
}

export function LandingPage({ clinic, onOpenModal }: LandingPageProps) {
  return (
    <div className="animate-landing-in">
      {/* Included Section */}
      <IncludedSection onOpenModal={onOpenModal} />

      {/* Steps Section */}
      <StepsSection onOpenModal={onOpenModal} />

      {/* Pricing Section */}
      <PricingSection onOpenModal={onOpenModal} />

      {/* Financing Band */}
      <FinancingSection clinic={clinic} onOpenModal={onOpenModal} />

      {/* Reasons Section */}
      <ReasonsSection clinic={clinic} />

      {/* Testimonials Section */}
      <TestimonialsSection clinic={clinic} />

      {/* Clinic Section */}
      <ClinicSection clinic={clinic} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection clinic={clinic} onOpenModal={onOpenModal} />

      {/* Footer */}
      <Footer clinic={clinic} />
    </div>
  )
}

// Included Section
const INCLUDED_ITEMS = [
  {
    icon: Stethoscope,
    title: "Undersökning",
    description:
      "Vi gör en grundlig klinisk undersökning av dina tänder, ditt tandkött och din käke för att kartlägga din situation och se vilka behandlingsalternativ som passar dig bäst.",
  },
  {
    icon: Scan,
    title: "Röntgenbilder",
    description:
      "Med röntgenbilder ser vi benstruktur och rotsystem i detalj, vilket ger oss en säker grund för att planera ditt implantat med precision.",
  },
  {
    icon: MessageCircle,
    title: "Konsultation",
    description:
      "Du får träffa en erfaren tandläkare som går igenom resultaten med dig, svarar på dina frågor och berättar om nästa steg – helt utan press att bestämma dig på plats.",
  },
]

const INCLUDED_EXTRAS = [
  {
    icon: ClipboardList,
    title: "Anpassad behandlingsplan",
    description:
      "Du får en plan skräddarsydd efter just din situation, med tydlig tidsplan och kostnad.",
  },
  {
    icon: HandCoins,
    title: "Information om bidrag och högkostnadsskydd",
    description:
      "Vi går igenom vilka bidrag och vilket högkostnadsskydd du kan använda för att sänka kostnaden.",
  },
]

function IncludedSection({
  onOpenModal,
}: {
  onOpenModal: (source: string) => void
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Det här ingår
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            En komplett genomgång, helt kostnadsfritt
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal">
          {INCLUDED_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="bg-surface border border-border rounded-[var(--r-sm)] p-6"
              >
                <div className="w-[46px] h-[46px] rounded-[12px] bg-coral-soft text-coral-deep grid place-items-center mb-3.5">
                  <Icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="font-display font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-[13.5px] text-muted mt-2 leading-[1.55]">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-5 border border-border-strong border-dashed rounded-[var(--r-sm)] p-5 reveal">
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted mb-3.5">
            Dessutom ingår
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INCLUDED_EXTRAS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-gold-soft text-gold-deep grid place-items-center flex-shrink-0">
                    <Icon className="w-[17px] h-[17px]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[14.5px]">
                      {item.title}
                    </div>
                    <p className="text-[13px] text-muted mt-0.5 leading-[1.5]">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-9">
          <button
            onClick={() => onOpenModal("included")}
            className="btn-gold py-4 px-7 text-[17px]"
          >
            Boka din kostnadsfria konsultation
          </button>
        </div>
      </div>
    </section>
  )
}

// Steps Section
function StepsSection({
  onOpenModal,
}: {
  onOpenModal: (source: string) => void
}) {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Så går det till
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Enkla steg till ett vackert leende
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface border border-border rounded-[var(--r-sm)] overflow-hidden"
            >
              <div className="aspect-[5/3.4] flex items-center justify-center bg-gradient-to-b from-[#FFFBF4] to-[#FCEFE7] border-b border-border">
                <ProcessStepIllustration step={step.number as 1 | 2 | 3 | 4} />
              </div>
              <div className="p-4">
                <div className="w-[26px] h-[26px] rounded-full bg-coral text-white font-display font-semibold text-[13px] grid place-items-center mb-2.5">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold text-[16.5px]">
                  {step.title}
                </h3>
                <p className="text-[13.5px] text-muted mt-1.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-9">
          <button
            onClick={() => onOpenModal("steps")}
            className="btn-gold py-4 px-7 text-[17px]"
          >
            Boka din kostnadsfria konsultation
          </button>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection({
  onOpenModal,
}: {
  onOpenModal: (source: string) => void
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Fast pris · ingen överraskning
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Tandimplantat till fast pris
          </h2>
          <p className="text-muted text-base mt-3">
            Räntefri delbetalning och ofta ännu lägre pris tack vare
            högkostnadsskyddet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
          {PRICING_CARDS.map((card) => (
            <div
              key={card.name}
              onClick={() => onOpenModal("pricecard")}
              className="bg-surface border border-border rounded-[var(--r-sm)] p-5 flex flex-col cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] hover:border-coral"
            >
              <div className="font-display font-semibold text-xl">
                {card.name}
              </div>
              <div className="text-[13.5px] text-muted mt-1 min-h-[38px]">
                {card.description}
              </div>
              <div className="mt-3.5 border-t border-dashed border-border-strong pt-3.5 flex justify-between gap-2.5">
                <div>
                  <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-muted">
                    Fast pris/mån
                  </div>
                  <div className="font-display font-semibold text-[22px] text-coral-deep">
                    {card.monthlyPrice}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-muted">
                    Totalt
                  </div>
                  <div className="font-display font-semibold text-lg text-ink">
                    {card.totalPrice}
                  </div>
                </div>
              </div>
              <div className="text-xs text-green mt-3 flex gap-1.5 items-center">
                <Check className="w-[17px] h-[17px]" />
                Kan bli ännu billigare med högkostnadsskyddet
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-[12.5px] mt-5 max-w-[620px] mx-auto">
          Räntefri delbetalning via Resurs Bank. Adm.avg. 20 kr/mån,
          uppläggningsavgift 149 kr. Priserna kan bli ännu lägre tack vare
          högkostnadsskyddet.
        </p>

        <div className="text-center mt-9">
          <button
            onClick={() => onOpenModal("prices")}
            className="btn-gold py-4 px-7 text-[17px]"
          >
            Se ditt pris – boka konsultation
          </button>
        </div>
      </div>
    </section>
  )
}

// Financing Section
function FinancingSection({
  clinic,
  onOpenModal,
}: {
  clinic: ClinicConfig
  onOpenModal: (source: string) => void
}) {
  const monthlyFromPrice = clinic.monthlyFromPrice || '300 kr'
  const ordinaryPrice = clinic.ordinaryPrice || '1 590 kr'
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="bg-ink text-white rounded-[var(--r)] p-8 md:p-10 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center reveal">
          <div>
            <div className="text-gold text-xs font-bold tracking-[0.14em] uppercase mb-3">
              Tillgängligt för alla
            </div>
            <h2 className="font-display font-semibold text-[clamp(25px,3.6vw,32px)] text-white">
              Vi vill att implantat ska vara tillgängligt för alla
            </h2>
            <p className="text-[#C9BFB3] mt-3.5 text-[15.5px]">
              Alla bör ha rätt till en god hälsa oavsett inkomst. Ingen ska
              behöva avstå från förebyggande eller estetisk tandvård av
              ekonomiska skäl – därför erbjuder vi fast pris och räntefri
              delbetalning per månad.
            </p>
            <button
              onClick={() => onOpenModal("alla")}
              className="btn-gold py-3 px-5 text-[15px] mt-5"
            >
              Prata med oss om upplägg
            </button>
          </div>
          <div className="bg-white/[0.06] border border-white/[0.12] rounded-[var(--r-sm)] p-6 text-center">
            <div className="font-display font-semibold text-[clamp(40px,7vw,64px)] text-gold leading-none">
              {monthlyFromPrice}
            </div>
            <div className="text-[#C9BFB3] text-sm mt-1.5">
              /mån för en enskild tand
            </div>
            <hr className="border-none border-t border-white/[0.12] my-4" />
            <div className="font-display font-semibold text-[34px] text-gold leading-none">
              0 kr
            </div>
            <div className="text-[#C9BFB3] text-sm mt-1.5">
              för din konsultation idag{" "}
              <s className="text-[#8E8479]">(ord. {ordinaryPrice})</s>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reasons Section
function ReasonsSection({ clinic }: { clinic: ClinicConfig }) {
  const iconMap = {
    shield: Shield,
    check: CheckCircle,
    star: Star,
    checkmark: Check,
  }

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Varför {clinic.name}
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Fyra anledningar att välja oss
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal">
          {REASONS.map((reason) => {
            const Icon = iconMap[reason.iconType]
            return (
              <div
                key={reason.title}
                className="bg-surface border border-border rounded-[var(--r-sm)] p-6"
              >
                <div className="w-[42px] h-[42px] rounded-[11px] bg-coral-soft text-coral-deep grid place-items-center mb-3.5">
                  <Icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="font-display font-semibold text-lg">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted mt-2">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection({ clinic }: { clinic: ClinicConfig }) {
  const reviews = clinic.reviews ?? TESTIMONIALS

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Vad våra patienter säger
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Trygg tandvård, varje gång
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
          {reviews.map((testimonial, index) => (
            <div
              key={index}
              className="bg-surface border border-border rounded-[var(--r-sm)] p-5"
            >
              <div className="text-gold-deep tracking-[2px] text-[15px]">
                {"★".repeat(testimonial.stars)}
              </div>
              <p className="text-[15px] mt-3 leading-[1.5]">
                {`"${testimonial.quote}"`}
              </p>
              <div className="mt-4 font-semibold text-sm">
                {testimonial.name}
                <span className="block text-muted font-normal text-[13px]">
                  {testimonial.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Clinic Section
function ClinicSection({ clinic }: { clinic: ClinicConfig }) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Besök oss
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Besök oss på {clinic.name}
          </h2>
          <p className="text-muted text-base mt-3">{clinic.address}</p>
          {clinic.openingHours && (
            <p className="text-muted text-sm mt-1.5">{clinic.openingHours}</p>
          )}
        </div>

        <div className="reveal rounded-[var(--r)] overflow-hidden border border-border" style={{ boxShadow: "var(--shadow)" }}>
          <iframe
            src={clinic.mapEmbedSrc}
            title="Karta till kliniken"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-10 reveal">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-coral-deep mb-3">
            Vanliga frågor
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,4.4vw,38px)] text-ink">
            Bra att veta om tandimplantat
          </h2>
        </div>

        <div className="max-w-[760px] mx-auto reveal">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
function FinalCTASection({
  clinic,
  onOpenModal,
}: {
  clinic: ClinicConfig
  onOpenModal: (source: string) => void
}) {
  return (
    <section className="pt-0 pb-16 md:pb-20">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-b from-[#FFF6EC] to-[#FFEDE3] border border-coral-soft rounded-[var(--r)] py-12 px-8 text-center reveal">
          <h2 className="font-display font-semibold text-[clamp(26px,4.6vw,38px)] max-w-[18ch] mx-auto text-balance">
            Redo att ta första steget mot ditt nya leende?
          </h2>
          <div className="flex gap-3.5 justify-center items-center flex-wrap mt-6">
            <button
              onClick={() => onOpenModal("final")}
              className="btn-gold py-4 px-7 text-[17px]"
            >
              Boka din kostnadsfria konsultation
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <GoogleRatingBadge clinic={clinic} />
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer({ clinic }: { clinic: ClinicConfig }) {
  return (
    <footer className="bg-ink text-[#C9BFB3] mt-16 py-12 pb-8">
      <div className="max-w-[1080px] mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-3.5">
          <img
            src={clinic.logoUrl}
            alt={clinic.name}
            className="h-7 w-auto brightness-0 invert"
          />
          <p className="text-[13.5px] max-w-[40ch]">
            Modern tandvård med fokus på trygghet, kvalitet och
            tillgänglighet.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13.5px]">
            <a
              href={`tel:${clinic.phoneTel}`}
              className="text-[#B7ACA0] no-underline hover:text-white transition-colors"
            >
              {clinic.phone}
            </a>
            <a
              href={`mailto:${clinic.email}`}
              className="text-[#B7ACA0] no-underline hover:text-white transition-colors"
            >
              {clinic.email}
            </a>
          </div>
          {clinic.orgNumber && (
            <p className="text-[12px] text-[#8E8479]">
              Org.nr: {clinic.orgNumber}
            </p>
          )}
        </div>

        <div className="border-t border-white/10 mt-8 pt-5 text-center text-[12.5px] text-[#8E8479]">
          © 2026 {clinic.name}. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  )
}
