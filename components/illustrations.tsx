// Tooth illustrations for quiz question 1
// These are coral-colored line art SVGs showing different tooth conditions

export function SingleToothIllustration() {
  return (
    <svg
      viewBox="0 0 150 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="w-full max-w-[128px] h-auto text-coral"
    >
      {/* Full teeth on left */}
      <path d="M12 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      <path d="M40 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      {/* Full teeth on right */}
      <path d="M96 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      <path d="M124 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      {/* Missing tooth (dashed) in middle */}
      <path
        d="M70 33c0-1.5 1-2.5 2.5-2.5h11c1.5 0 2.5 1 2.5 2.5v22c0 6-16 6-16 0V33Z"
        strokeDasharray="4 4"
        opacity="0.7"
      />
    </svg>
  )
}

export function MultiToothIllustration() {
  return (
    <svg
      viewBox="0 0 150 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="w-full max-w-[128px] h-auto text-coral"
    >
      {/* Full teeth on edges */}
      <path d="M12 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      <path d="M40 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      <path d="M124 30c0-3 2-5 5-5h12c3 0 5 2 5 5v26c0 8-22 8-22 0V30Z" />
      {/* Two missing teeth (dashed) */}
      <path
        d="M70 33c0-1.5 1-2.5 2.5-2.5h11c1.5 0 2.5 1 2.5 2.5v22c0 6-16 6-16 0V33Z"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      <path
        d="M98 33c0-1.5 1-2.5 2.5-2.5h11c1.5 0 2.5 1 2.5 2.5v22c0 6-16 6-16 0V33Z"
        strokeDasharray="4 4"
        opacity="0.7"
      />
    </svg>
  )
}

export function DentureIllustration() {
  return (
    <svg
      viewBox="0 0 150 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="w-full max-w-[128px] h-auto text-coral"
    >
      {/* Denture base */}
      <path
        d="M22 38c0-16 18-26 53-26s53 10 53 26c0 18-12 30-22 30-7 0-9-7-16-7h-30c-7 0-9 7-16 7-10 0-22-12-22-30Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Teeth on denture */}
      <path d="M40 34c0-3 2-4 5-4h9c3 0 5 1 5 4v12c0 6-19 6-19 0V34Z" />
      <path d="M64 32c0-3 2-4 5-4h12c3 0 5 1 5 4v13c0 6-22 6-22 0V32Z" />
      <path d="M92 34c0-3 2-4 5-4h9c3 0 5 1 5 4v12c0 6-19 6-19 0V34Z" />
    </svg>
  )
}

export function MostTeethIllustration() {
  return (
    <svg
      viewBox="0 0 150 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="w-full max-w-[128px] h-auto text-coral"
    >
      {/* Mix of damaged and missing teeth */}
      <path
        d="M10 30c0-3 2-5 5-5h11c3 0 5 2 5 5v26c0 8-21 8-21 0V30Z"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      <path d="M38 30c0-3 2-5 5-5h11c3 0 5 2 5 5v26c0 8-21 8-21 0V30Z" />
      {/* Cracked tooth */}
      <path d="M66 28c0-2 2-4 5-4h11c3 0 5 2 5 4v30c0 9-21 9-21 0V28Z" />
      {/* Lightning bolt crack */}
      <path
        d="M77 26l-6 12 8 5-7 11"
        stroke="currentColor"
        className="text-coral-deep"
        strokeWidth="2.6"
      />
      <path
        d="M94 30c0-3 2-5 5-5h11c3 0 5 2 5 5v26c0 8-21 8-21 0V30Z"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      <path d="M122 30c0-3 2-5 5-5h11c3 0 5 2 5 5v26c0 8-21 8-21 0V30Z" />
    </svg>
  )
}

// Map illustration type to component
export function ToothIllustration({
  type,
}: {
  type: "single" | "multi" | "denture" | "most"
}) {
  switch (type) {
    case "single":
      return <SingleToothIllustration />
    case "multi":
      return <MultiToothIllustration />
    case "denture":
      return <DentureIllustration />
    case "most":
      return <MostTeethIllustration />
    default:
      return null
  }
}

// Process step illustrations
export function Step1Illustration() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-16 h-16 text-coral"
    >
      {/* Tooth being removed */}
      <path d="M22 14c-5 0-8 4-7 10 1 7 1 9 3 16 1 4 2 8 5 8s2-7 5-7" />
      <path d="M42 14c5 0 8 4 7 10-1 7-1 9-3 16-1 4-2 8-5 8" opacity="0.4" />
      {/* X marks removal */}
      <path d="M30 44l8 8M38 44l-8 8" className="text-coral-deep" />
    </svg>
  )
}

export function Step2Illustration() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-16 h-16 text-coral"
    >
      {/* Titanium screw */}
      <path d="M32 8v34" />
      <path d="M26 14h12M25 20h14M27 26h10M28 32h8" />
      {/* Screw tip */}
      <path d="M32 42l-4 8h8l-4-8Z" />
    </svg>
  )
}

export function Step3Illustration() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-16 h-16 text-coral"
    >
      {/* Abutment */}
      <rect x="26" y="10" width="12" height="14" rx="3" />
      <path d="M32 24v6" />
      {/* Base */}
      <path d="M27 30h10v22c0 4-10 4-10 0V30Z" />
    </svg>
  )
}

export function Step4Illustration() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-16 h-16 text-coral"
    >
      {/* Complete tooth crown */}
      <path d="M24 14c-5 0-7 4-6 10 1 7 1 10 3 17 1 4 2 7 5 7s3-9 6-9 3 9 6 9 4-3 5-7c2-7 2-10 3-17 1-6-1-10-6-10-4 0-6 3-8 3s-4-3-8-3Z" />
    </svg>
  )
}

export function ProcessStepIllustration({ step }: { step: 1 | 2 | 3 | 4 }) {
  switch (step) {
    case 1:
      return <Step1Illustration />
    case 2:
      return <Step2Illustration />
    case 3:
      return <Step3Illustration />
    case 4:
      return <Step4Illustration />
    default:
      return null
  }
}
