'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Check } from 'lucide-react'

import { useQuizState } from '@/hooks/use-quiz-state'
import { QuizCard } from '@/components/quiz-card'
import { AnalysisScreen } from '@/components/analysis-screen'
import { LandingPage } from '@/components/landing-page'
import { SiteHeader } from '@/components/site-header'
import { OptInModal } from '@/components/opt-in-modal'
import { CAMPAIGNS, DEFAULT_CAMPAIGN } from '@/lib/campaigns'
import { DEFAULT_CLINIC } from '@/lib/clinics'
import type { ClinicConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

// ─── Inner page (needs useSearchParams, must be inside <Suspense>) ─────────────

function QuizPageInner({ clinic }: { clinic: ClinicConfig }) {
  const searchParams = useSearchParams()
  const campaignKey = searchParams.get('v') ?? 'general'
  const campaign = CAMPAIGNS[campaignKey] ?? DEFAULT_CAMPAIGN
  const { hero, questions } = campaign

  const quiz = useQuizState(questions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSource, setModalSource] = useState('quiz')

  // Scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [quiz.phase])

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [quiz.phase])

  const handleOpenModal = useCallback((source: string) => {
    setModalSource(source)
    setIsModalOpen(true)
  }, [])

  const isQuizPhase = quiz.phase === 'quiz'

  return (
    <div className="min-h-screen bg-transparent">
      <SiteHeader clinic={clinic} phase={quiz.phase} onOpenModal={() => handleOpenModal('header')} />

      {isQuizPhase ? (
        <main className="min-h-[calc(100vh-58px)] flex flex-col justify-center px-4 py-8">
          <div className="max-w-[760px] mx-auto w-full">

            {/* ── Hero copy — swap here to A/B test ad hooks ── */}
            {(() => {
              const isFirst = quiz.currentIndex === 0
              return (
                <div className={cn(
                  'text-center flex flex-col items-center reveal in',
                  isFirst ? 'gap-4 mb-8' : 'gap-2.5 mb-5'
                )}>
                  <span className={cn(
                    'inline-flex items-center gap-2 font-bold tracking-[0.12em] uppercase text-coral-deep bg-coral-soft rounded-full transition-all duration-300',
                    isFirst ? 'text-[13.5px] py-2.5 px-4' : 'text-[12.5px] py-2 px-3.5'
                  )}>
                    <Sparkles className={isFirst ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                    {hero.eyebrow}
                  </span>
                  <p className={cn(
                    'font-display font-semibold text-ink text-balance transition-all duration-300',
                    isFirst ? 'text-[clamp(24px,4.2vw,44px)] max-w-[30ch] leading-[1.12]' : 'text-[clamp(20px,3.4vw,26px)] max-w-[24ch] leading-[1.18] font-medium'
                  )}>
                    {hero.headline}
                  </p>
                  {hero.sub && (
                    <p className={cn(
                      'text-muted text-balance transition-all duration-300',
                      isFirst ? 'text-[17px] max-w-[36ch]' : 'text-[15px] max-w-[38ch]'
                    )}>
                      {hero.sub}
                    </p>
                  )}
                </div>
              )
            })()}

            {quiz.currentQuestion && (
              <QuizCard
                question={quiz.currentQuestion}
                currentIndex={quiz.currentIndex}
                totalQuestions={quiz.totalQuestions}
                progress={quiz.progress}
                selectedAnswer={quiz.answers[quiz.currentQuestion.id]}
                isLocked={quiz.isLocked}
                onSelect={quiz.selectAnswer}
                onBack={quiz.goBack}
              />
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-[640px] mx-auto">
              {clinic.showGoogleRating !== false && (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink bg-surface border border-border py-2 px-3.5 rounded-full" style={{ boxShadow: 'var(--shadow)' }}>
                  <span className="text-gold-deep tracking-[1px]">★★★★★</span>{' '}
                  {(clinic.googleRating ?? 4.7).toFixed(1).replace('.', ',')}/5 på{' '}
                  <b className="font-display" style={{ color: '#4285F4' }}>G</b>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink bg-surface border border-border py-2 px-3.5 rounded-full" style={{ boxShadow: 'var(--shadow)' }}>
                <Check className="w-[15px] h-[15px] text-coral" />
                Livstidsgaranti på implantatet
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink bg-surface border border-border py-2 px-3.5 rounded-full" style={{ boxShadow: 'var(--shadow)' }}>
                <Check className="w-[15px] h-[15px] text-coral" />
                Gäller högkostnadsskyddet
              </span>
            </div>

          </div>
        </main>
      ) : (
        <>
          <main className="py-8 md:py-12">
            <div className="max-w-[1080px] mx-auto px-4 md:px-6">
              <AnalysisScreen
                answers={quiz.answers}
                clinic={clinic}
                onOpenModal={() => handleOpenModal('analysis')}
                onBack={() => {
                  quiz.returnToQuiz()
                  window.scrollTo({ top: 0 })
                }}
              />
            </div>
          </main>
          <LandingPage clinic={clinic} onOpenModal={handleOpenModal} />
        </>
      )}

      <OptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={modalSource}
        quizAnswers={quiz.answers}
        clinic={clinic}
      />
    </div>
  )
}

// ─── Shell with Suspense boundary (required by Next.js for useSearchParams) ────

export function QuizPage({ clinic = DEFAULT_CLINIC }: { clinic?: ClinicConfig }) {
  return (
    <Suspense>
      <QuizPageInner clinic={clinic} />
    </Suspense>
  )
}
