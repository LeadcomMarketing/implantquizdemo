"use client"

import { useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Lightbulb, Check } from "lucide-react"
import type { QuizQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"

interface QuizCardProps {
  question: QuizQuestion
  currentIndex: number
  totalQuestions: number
  progress: number
  selectedAnswer?: string
  isLocked: boolean
  onSelect: (value: string) => void
  onBack: () => void
}

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  progress,
  selectedAnswer,
  isLocked,
  onSelect,
  onBack,
}: QuizCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation (1-9 keys select options)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 9 && num <= question.options.length) {
        const option = question.options[num - 1]
        if (option && !isLocked) {
          onSelect(option.value)
        }
      }
    },
    [question.options, isLocked, onSelect]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Focus management - focus first option on question change
  useEffect(() => {
    const firstOption = containerRef.current?.querySelector<HTMLButtonElement>(
      'button[data-option="true"]'
    )
    firstOption?.focus()
  }, [question.id])

  return (
    <div
      ref={containerRef}
      className="max-w-[680px] mx-auto bg-surface border border-border rounded-[var(--r)] overflow-hidden"
      style={{
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Progress header */}
      <div className="px-5 pt-4 pb-0 md:px-7 md:pt-5">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[11.5px] font-bold tracking-[0.13em] uppercase text-muted">
            Fråga {currentIndex + 1} av {totalQuestions}
          </span>
          <span className="font-display font-semibold text-[13px] text-coral-deep">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-cream-2 overflow-hidden">
          <div
            className="h-full rounded-full progress-fill transition-[width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Question body */}
      <div className="p-5 md:p-7 stagger">
        {/* Eyebrow */}
        <div>
          <span className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] uppercase text-coral-deep bg-coral-soft px-3 py-1.5 rounded-full mb-4">
            {question.eyebrow}
          </span>
        </div>

        {/* Question text */}
        <h1 className="font-display font-semibold text-[clamp(26px,5.4vw,36px)] text-ink max-w-[19ch] leading-[1.08]">
          {question.question}
        </h1>

        {/* Subtext */}
        {question.subtext && (
          <p className="mt-3 text-muted text-[15.5px] max-w-[46ch]">
            {question.subtext}
          </p>
        )}

        {/* Options */}
        <div
          className={cn(
            "grid gap-3 mt-6",
            question.type === "image" ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {question.options.map((option, index) => (
            <QuizOption
              key={option.value}
              option={option}
              index={index}
              isImage={question.type === "image"}
              isSelected={selectedAnswer === option.value}
              isLocked={isLocked}
              onSelect={() => onSelect(option.value)}
            />
          ))}
        </div>

        {/* Why we ask */}
        {question.why && (
          <div className="mt-5 border border-border bg-[#FFFCF6] rounded-[var(--r-sm)] p-3 flex gap-3 items-start">
            <div className="flex-shrink-0 w-[30px] h-[30px] rounded-[9px] bg-gold-soft flex items-center justify-center text-gold-deep">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10.5px] font-bold tracking-[0.1em] uppercase text-gold-deep mb-0.5">
                Varför vi frågar
              </div>
              <div className="text-[13.5px] text-muted leading-[1.45]">
                {question.why}
              </div>
            </div>
          </div>
        )}

        {/* Reassurance */}
        {question.reassure && (
          <div className="mt-4 border border-[#D7EEE1] bg-green-soft rounded-[var(--r-sm)] p-3 flex gap-3 items-start">
            <div className="flex-shrink-0 text-green">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10.5px] font-bold tracking-[0.1em] uppercase text-green mb-0.5">
                Bra att veta
              </div>
              <div className="text-[13.5px] text-[#3c6b52] leading-[1.45]">
                {question.reassure}
              </div>
            </div>
          </div>
        )}

        {/* Back button */}
        {currentIndex > 0 && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-body text-[13.5px] font-semibold text-muted mt-5 py-1 px-0.5 transition-all duration-150 hover:text-ink hover:gap-2.5"
          >
            <ChevronLeft className="w-[15px] h-[15px]" />
            Tillbaka
          </button>
        )}
      </div>
    </div>
  )
}

interface QuizOptionProps {
  option: {
    value: string
    label: string
    illustration?: "single" | "multi" | "denture" | "most"
  }
  index: number
  isImage: boolean
  isSelected: boolean
  isLocked: boolean
  onSelect: () => void
}

function QuizOption({
  option,
  index,
  isImage,
  isSelected,
  isLocked,
  onSelect,
}: QuizOptionProps) {
  if (isImage && option.illustration) {
    return (
      <button
        data-option="true"
        onClick={onSelect}
        disabled={isLocked}
        className={cn(
          "relative text-left cursor-pointer bg-surface border-[1.5px] rounded-[var(--r-sm)] p-0 overflow-hidden flex flex-col font-body text-base font-medium text-ink w-full transition-all duration-150",
          "hover:transform hover:-translate-y-0.5 hover:border-coral hover:shadow-[0_12px_26px_rgba(255,121,99,0.16)]",
          "focus-visible:outline-none focus-visible:border-coral focus-visible:shadow-[0_0_0_4px_var(--coral-soft)]",
          isSelected
            ? "border-coral bg-coral-soft shadow-[0_0_0_4px_var(--coral-soft)]"
            : "border-border-strong"
        )}
      >
        {/* Number badge */}
        <span
          className={cn(
            "absolute top-2 left-2 w-6 h-6 rounded-lg grid place-items-center font-display font-semibold text-xs border transition-colors",
            isSelected
              ? "bg-coral text-white border-transparent"
              : "bg-cream text-muted border-border"
          )}
        >
          {index + 1}
        </span>

        {/* Photo */}
        <span className="border-b border-border block overflow-hidden aspect-square">
          <img
            src={`/quiz-${option.illustration}.jpg`}
            alt={option.label}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              isSelected ? "scale-[1.03]" : "hover:scale-[1.03]"
            )}
          />
        </span>

        {/* Label */}
        <span className="p-3 text-[15px] font-semibold leading-[1.25] text-center">
          {option.label}
        </span>
      </button>
    )
  }

  // Text option
  return (
    <button
      data-option="true"
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        "relative text-left cursor-pointer bg-surface border-[1.5px] rounded-[var(--r-sm)] py-4 px-4 flex items-center gap-3 font-body text-base font-medium text-ink w-full transition-all duration-150 leading-[1.35]",
        "hover:transform hover:-translate-y-0.5 hover:border-coral hover:shadow-[0_12px_26px_rgba(255,121,99,0.16)]",
        "focus-visible:outline-none focus-visible:border-coral focus-visible:shadow-[0_0_0_4px_var(--coral-soft)]",
        isSelected
          ? "border-coral bg-coral-soft shadow-[0_0_0_4px_var(--coral-soft)]"
          : "border-border-strong"
      )}
    >
      {/* Number badge */}
      <span
        className={cn(
          "flex-shrink-0 w-[27px] h-[27px] rounded-lg grid place-items-center font-display font-semibold text-[13px] border transition-colors",
          isSelected
            ? "bg-coral text-white border-transparent"
            : "bg-cream text-muted border-border"
        )}
      >
        {index + 1}
      </span>

      {/* Label */}
      <span className="flex-1">{option.label}</span>

      {/* Arrow */}
      <span
        className={cn(
          "flex-shrink-0 transition-all duration-150",
          isSelected ? "text-coral" : "text-muted-2 group-hover:text-coral"
        )}
      >
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
