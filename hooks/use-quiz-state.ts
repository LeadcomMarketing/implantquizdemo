"use client"

import { useState, useCallback, useMemo } from "react"
import type { QuizAnswers, QuizPhase, QuizQuestion } from "@/lib/types"
import { QUIZ_QUESTIONS } from "@/lib/constants"

export function useQuizState(questions: QuizQuestion[] = QUIZ_QUESTIONS) {
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [currentQuestionId, setCurrentQuestionId] = useState(questions[0].id)
  const [phase, setPhase] = useState<QuizPhase>("quiz")
  const [isLocked, setIsLocked] = useState(false)

  // Get visible questions based on conditional logic
  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (!q.conditionalOn) return true
      return answers[q.conditionalOn.questionId] === q.conditionalOn.value
    })
  }, [questions, answers])

  // Get current question index
  const currentIndex = useMemo(() => {
    return visibleQuestions.findIndex((q) => q.id === currentQuestionId)
  }, [visibleQuestions, currentQuestionId])

  // Get current question
  const currentQuestion = useMemo(() => {
    return visibleQuestions.find((q) => q.id === currentQuestionId)
  }, [visibleQuestions, currentQuestionId])

  // Calculate progress
  const progress = useMemo(() => {
    if (phase === "analysis") return 100
    const total = visibleQuestions.length
    return Math.round(((currentIndex + 1) / total) * 100)
  }, [phase, currentIndex, visibleQuestions.length])

  // Select an answer and auto-advance
  const selectAnswer = useCallback(
    (value: string) => {
      if (isLocked) return

      setIsLocked(true)
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: value }))

      setTimeout(() => {
        setIsLocked(false)

        const newAnswers = { ...answers, [currentQuestionId]: value }
        const newVisibleQuestions = questions.filter((q) => {
          if (!q.conditionalOn) return true
          return newAnswers[q.conditionalOn.questionId] === q.conditionalOn.value
        })

        const currentPos = newVisibleQuestions.findIndex(
          (q) => q.id === currentQuestionId
        )
        const nextQuestion = newVisibleQuestions[currentPos + 1]

        if (nextQuestion) {
          setCurrentQuestionId(nextQuestion.id)
        } else {
          setPhase("analysis")
        }
      }, 260)
    },
    [questions, answers, currentQuestionId, isLocked]
  )

  // Go back to previous question
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentQuestionId(visibleQuestions[currentIndex - 1].id)
    }
  }, [currentIndex, visibleQuestions])

  // Return to quiz from analysis (go back to last question)
  const returnToQuiz = useCallback(() => {
    setPhase("quiz")
    const lastQuestion = visibleQuestions[visibleQuestions.length - 1]
    if (lastQuestion) {
      setCurrentQuestionId(lastQuestion.id)
    }
  }, [visibleQuestions])

  // Reset entire quiz
  const resetQuiz = useCallback(() => {
    setAnswers({})
    setCurrentQuestionId(questions[0].id)
    setPhase("quiz")
  }, [questions])

  return {
    answers,
    currentQuestionId,
    currentQuestion,
    currentIndex,
    phase,
    isLocked,
    visibleQuestions,
    progress,
    totalQuestions: visibleQuestions.length,
    selectAnswer,
    goBack,
    returnToQuiz,
    resetQuiz,
    setPhase,
  }
}

export type UseQuizStateReturn = ReturnType<typeof useQuizState>
