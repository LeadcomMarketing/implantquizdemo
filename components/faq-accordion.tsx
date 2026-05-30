"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { FAQItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <FAQItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  )
}

interface FAQItemProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-border rounded-[var(--r-sm)] bg-surface overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left bg-transparent border-none cursor-pointer py-4 px-5 flex items-center justify-between gap-3.5 font-body font-semibold text-base text-ink"
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <span
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full bg-coral text-white grid place-items-center transition-transform duration-250",
            isOpen && "rotate-45"
          )}
        >
          <Plus className="w-4 h-4" />
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-out",
          isOpen ? "max-h-[500px]" : "max-h-0"
        )}
        style={{
          maxHeight: isOpen ? "500px" : "0",
        }}
      >
        <p className="px-5 pb-4 text-muted text-[14.5px] leading-[1.55]">
          {item.answer}
        </p>
      </div>
    </div>
  )
}
