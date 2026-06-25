import type { ClinicConfig } from "@/lib/types"

export function GoogleRatingBadge({ clinic }: { clinic: ClinicConfig }) {
  if (clinic.showGoogleRating === false) return null
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink bg-surface border border-border py-2 px-3.5 rounded-full"
      style={{ boxShadow: "var(--shadow)" }}
    >
      <span className="text-gold-deep tracking-[1px]">★★★★★</span>{" "}
      {(clinic.googleRating ?? 4.7).toFixed(1).replace(".", ",")}/5 på{" "}
      <b className="font-display" style={{ color: "#4285F4" }}>
        G
      </b>
    </span>
  )
}
