import type {
  QuizQuestion,
  PricingCard,
  FAQItem,
  Testimonial,
  ProcessStep,
  Reason,
  ClinicInfo,
} from "./types"

// Quiz Questions - Swedish dental implant funnel
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "condition",
    eyebrow: "Fråga 1",
    type: "image",
    question: "Vad stämmer bäst in på dig?",
    subtext: "Välj det alternativ som passar din situation bäst.",
    options: [
      {
        value: "single",
        label: "Jag saknar eller har problem med en tand",
        illustration: "single",
      },
      {
        value: "multi",
        label: "Jag saknar eller har problem med flera tänder",
        illustration: "multi",
      },
      {
        value: "denture",
        label: "Jag kämpar med en löstagbar protes",
        illustration: "denture",
      },
      {
        value: "most",
        label: "De flesta av mina tänder är i dåligt skick",
        illustration: "most",
      },
    ],
    why: "Olika problem kräver olika lösningar. Ditt svar hjälper oss att förbereda rätt bedömning för just dig.",
  },
  {
    id: "eating",
    eyebrow: "Fråga 2",
    type: "text",
    question: "Kan du äta bekvämt?",
    options: [
      { value: "oneside", label: "Jag tuggar mest på ena sidan" },
      { value: "pain", label: "Jag har ont när jag tuggar" },
      { value: "limit", label: "Jag begränsar vilken mat jag kan äta" },
      { value: "fine", label: "Ja, jag kan äta utan problem" },
    ],
  },
  {
    id: "confidence",
    eyebrow: "Fråga 3",
    type: "text",
    question:
      "Känner du dig osäker i sociala situationer eller döljer du ditt leende?",
    options: [
      { value: "often", label: "Ja, det händer ofta" },
      { value: "sometimes", label: "Ibland" },
      { value: "no", label: "Nej, det påverkar mig inte" },
    ],
  },
  {
    id: "urgency",
    eyebrow: "Fråga 4",
    type: "text",
    question: "Hur brådskande är behandlingen för dig?",
    options: [
      {
        value: "asap",
        label:
          "Så snart som möjligt – jag är trött på hur det känns och vill förbättra min livskvalitet",
      },
      {
        value: "1-3m",
        label:
          "Inom 1–3 månader – jag vill verkligen göra detta, jag behöver bara lite mer tid",
      },
      { value: "research", label: "Jag undersöker fortfarande mina alternativ" },
    ],
    reassure:
      "Inga krav på att boka idag. Du bestämmer takten – vi ger dig underlaget att fatta ett tryggt beslut.",
  },
  {
    id: "roadblock",
    eyebrow: "Fråga 5",
    type: "text",
    question: "Vad har varit det största hindret för att fixa ditt leende?",
    options: [
      { value: "ready", label: "Inget! Jag är redo nu" },
      { value: "cost", label: "Kostnaden för tandbehandlingar" },
      { value: "fear", label: "Rädsla för tandbehandlingar" },
      { value: "time", label: "Tiden behandlingar tar" },
      {
        value: "trust",
        label: "Jag har inte hittat en tandläkare jag känner mig trygg med",
      },
    ],
  },
  {
    id: "payment",
    eyebrow: "Fråga 6",
    type: "text",
    question: "Är du intresserad av delbetalning?",
    options: [
      {
        value: "yes",
        label: "Ja, jag är intresserad av prisvärda delbetalningsalternativ",
      },
      {
        value: "no",
        label: "Nej, jag har sparat för detta och behöver ingen delbetalning",
      },
    ],
  },
  {
    id: "income",
    eyebrow: "Fråga 6 · forts.",
    type: "text",
    question:
      "Finansieringsbolag frågar efter en inkomstkälla. Har du en inkomst?",
    options: [
      {
        value: "yes",
        label: "Ja, jag har en inkomst (lön, pension eller liknande)",
      },
      { value: "no", label: "Nej, jag har ingen inkomst just nu" },
    ],
    conditionalOn: {
      questionId: "payment",
      value: "yes",
    },
    why: "Vi frågar för att kunna föreslå rätt finansieringsupplägg redan på konsultationen – inga uppgifter delas utan ditt godkännande.",
  },
]

// Pricing Cards
export const PRICING_CARDS: PricingCard[] = [
  {
    name: "Entandslucka",
    description: "För dig som saknar en tand.",
    monthlyPrice: "300 kr/mån",
    totalPrice: "16 495 kr",
  },
  {
    name: "Tvåtandslucka",
    description: "För dig som saknar två granntänder.",
    monthlyPrice: "300 kr/mån",
    totalPrice: "21 774 kr",
  },
  {
    name: "Tretandslucka",
    description: "För dig som saknar tre granntänder.",
    monthlyPrice: "300 kr/mån",
    totalPrice: "22 467 kr",
  },
  {
    name: "Fyrtandslucka",
    description: "För dig som saknar fyra granntänder.",
    monthlyPrice: "300 kr/mån",
    totalPrice: "27 239 kr",
  },
  {
    name: "Helkäke – under",
    description: "För dig som saknar alla tänder i underkäken.",
    monthlyPrice: "1 500 kr/mån",
    totalPrice: "35 645 kr",
  },
  {
    name: "Helkäke – över",
    description: "För dig som saknar alla tänder i överkäken.",
    monthlyPrice: "1 500 kr/mån",
    totalPrice: "37 018 kr",
  },
]

// FAQ Items
export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Gör det ont att få tandimplantat?",
    answer:
      "Behandlingen görs med lokalbedövning och de flesta upplever betydligt mindre obehag än de väntat sig. Efter ingreppet kan området kännas ömt i några dagar, vilket lindras med vanlig värktablett.",
  },
  {
    question: "Hur lång tid tar behandlingen?",
    answer:
      "Det varierar med din situation. Själva ingreppet tar ofta under en timme, men eftersom benet behöver läka kring skruven sträcker sig hela processen vanligtvis över några månader. Du får en tydlig tidsplan på konsultationen.",
  },
  {
    question: "Gäller högkostnadsskyddet för tandimplantat?",
    answer:
      "Ja, delar av behandlingen kan omfattas av det statliga högkostnadsskyddet, vilket ofta sänker din kostnad. Vi går igenom exakt vad som gäller för dig.",
  },
  {
    question: "Kan jag betala in mer än mitt månadsbelopp?",
    answer:
      "Ja. Delbetalningen är räntefri via Resurs Bank och du kan när som helst betala in extra eller lösa hela beloppet utan extra kostnad.",
  },
  {
    question: "Hur länge håller ett tandimplantat?",
    answer:
      "Med god munhygien och regelbundna kontroller håller ett implantat mycket länge – ofta resten av livet. Vi lämnar dessutom livstidsgaranti på själva implantatskruven.",
  },
  {
    question: "Vad är riskerna med tandimplantat?",
    answer:
      "Tandimplantat är en väl beprövad och säker behandling. Som vid alla ingrepp finns vissa risker, men de är små. Vi gör alltid en noggrann bedömning först och går igenom allt med dig.",
  },
]

// Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    stars: 5,
    quote:
      "Jag hade tappat självförtroendet helt. Nu vågar jag le igen – och hela vägen kändes trygg från första besöket.",
    name: "Sofia",
    location: "Göteborg",
  },
  {
    stars: 5,
    quote:
      "Proffsigt och omtänksamt bemötande. De förklarade allt och fasta priset gjorde det enkelt att bestämma sig.",
    name: "Anton",
    location: "Malmö",
  },
  {
    stars: 5,
    quote:
      "Superärligt och professionellt. Jag kände mig kunnig och trygg hela vägen och rekommenderar dem varmt.",
    name: "Emma",
    location: "Stockholm",
  },
]

// Process Steps
export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "Avlägsnande av skadad tand",
    description:
      "Efter en grundlig undersökning avlägsnar vi den skadade tanden – skonsamt och utan onödig smärta.",
  },
  {
    number: 2,
    title: "Applicering av titanskruv",
    description:
      "Genom ett kirurgiskt ingrepp fästs titanskruven i käkbenet och blir din nya tandrot.",
  },
  {
    number: 3,
    title: "Stödjepunkt fästs i skruven",
    description:
      "Därefter fästs distansen som blir länken mellan skruven och din nya tand.",
  },
  {
    number: 4,
    title: "Din nya tand appliceras",
    description:
      "Sist fäster vi din nya tand – du går härifrån med ett leende som håller livet ut.",
  },
]

// Reasons to Choose
export const REASONS: Reason[] = [
  {
    title: "Hållbart över tid",
    description:
      "Till skillnad från löstagbara proteser sitter implantatet fast i käkbenet och har en betydligt längre livslängd.",
    iconType: "shield",
  },
  {
    title: "Smidigt i vardagen",
    description:
      "Eftersom tanden sitter fast behöver du aldrig tänka på den – ät, prata och le precis som vanligt.",
    iconType: "check",
  },
  {
    title: "Livstidsgaranti",
    description:
      "Vi är så trygga i vår kvalitet att vi erbjuder livstidsgaranti på våra implantatskruvar.",
    iconType: "star",
  },
  {
    title: "Skonsamt för granntänderna",
    description:
      "Till skillnad från en brobrygga behöver vi inte slipa ned dina friska granntänder.",
    iconType: "checkmark",
  },
]

// Clinic info — headline, location sub-headline and Google Maps embed.
// TODO: Swap mapEmbedSrc for the clinic's real Google Maps "Share > Embed a map" src URL.
export const CLINIC_INFO: ClinicInfo = {
  eyebrow: "Besök oss",
  headline: "Din klinik mitt i Stockholm",
  subheadline: "Happident Stockholm — Kungsgatan 12, 111 35 Stockholm",
  mapEmbedSrc:
    "https://www.google.com/maps?q=Kungsgatan+12,+111+35+Stockholm&output=embed",
}

// Condition descriptions for analysis
export const CONDITION_DESCRIPTIONS: Record<string, string> = {
  single: "en saknad eller skadad tand",
  multi: "flera saknade eller skadade tänder",
  denture: "en löstagbar protes som inte sitter som den ska",
  most: "tänder som överlag är i dåligt skick",
}

// Urgency messages for analysis
export const URGENCY_MESSAGES: Record<string, string> = {
  asap: "Eftersom du vill komma igång snart kan vi ofta erbjuda en tid redan denna vecka.",
  "1-3m": "Vi hjälper dig att planera in behandlingen i den takt som passar dig.",
  research:
    "Konsultationen är ett bra nästa steg för att få svar på alla dina frågor – helt utan förbindelse.",
}

// Footer links
export const FOOTER_LINKS = {
  treatments: [
    "Tandimplantat",
    "Allmäntandvård",
    "Akut tandvård",
    "Abonnemangstandvård",
    "Tistandvård 67+",
  ],
  clinics: [
    "Stockholm",
    "Göteborg",
    "Malmö",
    "Uppsala",
    "Lund",
    "Borås",
    "Alingsås",
  ],
  company: [
    "Kontakta oss",
    "Karriär",
    "Tandvårdsbidrag",
    "010-330 31 00",
    "info@happident.se",
  ],
}
