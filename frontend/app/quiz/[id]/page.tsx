'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { quizService, SubmitQuizResponse } from '@/services/quiz.service'
import type { QuizQuestion } from '@/types'
import {
  ArrowLeft,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const QUIZ_DURATION_SECONDS = 10 * 60 // 10 minutes

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const topicId = Number(params.id)

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<SubmitQuizResponse | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const loadQuiz = async () => {
    setLoading(true)
    setSubmitted(false)
    setAnswers({})
    setResults(null)
    setCurrentQuestionIndex(0)
    setTimeLeft(QUIZ_DURATION_SECONDS)
    
    try {
      const data = await quizService.getQuiz(topicId)
      if (!data || data.length === 0) {
        showToast('No quiz questions generated for this topic yet', 'info')
        router.back()
        return
      }
      setQuestions(data)
    } catch {
      showToast('Failed to load quiz details', 'error')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (topicId) {
      loadQuiz()
    }
  }, [topicId])

  useEffect(() => {
    if (loading || submitted || questions.length === 0) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, submitted, questions])

  const handleSelectOption = (quizId: number, optionText: string) => {
    if (submitted) return
    setAnswers((prev) => ({
      ...prev,
      [quizId]: optionText
    }))
  }

  const handleSubmit = async (isTimeout = false) => {
    if (submitted) return
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)

    if (isTimeout) {
      showToast('Time limit exceeded! Auto-submitting answers.', 'info')
    } else {
      showToast('Submitting your quiz...', 'info')
    }

    const formattedAnswers = questions.map((q) => ({
      quizId: q.id,
      selectedAnswer: answers[q.id] || ''
    }))

    try {
      const response = await quizService.submitQuiz(topicId, formattedAnswers)
      setResults(response)
      setSubmitted(true)
      showToast('Quiz submitted successfully!', 'success')
    } catch (error) {
      showToast('Failed to submit quiz results', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (questions.length === 0) return null

  // Submitted Score Card & Answers Review Breakdown
  if (submitted && results) {
    return (
      <DashboardLayout>
        <div className="space-y-10 max-w-3xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-905 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Topics
          </button>

          {/* Result Score Card */}
          <Card className="p-8 md:p-12 text-center bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0F172A] space-y-6">
            <div className="p-4 bg-blue-50 border-2 border-slate-900 text-primary w-fit mx-auto shadow-[2px_2px_0px_0px_#0F172A]">
              <Award className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Quiz Completed!</h1>
              <p className="text-[10px] text-slate-550 font-black uppercase tracking-wider">
                Topic ID: #{topicId} • Scores Report
              </p>
            </div>

            <div className="flex justify-center gap-10 py-6 border-t border-b-2 border-slate-900 max-w-md mx-auto">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Comp Grade</p>
                <p className="text-4xl font-black text-slate-950 mt-1">{results.score}%</p>
              </div>
              <div className="border-r-2 border-slate-900" />
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Questions Correct</p>
                <p className="text-4xl font-black text-slate-950 mt-1">
                  {results.correctAnswers} <span className="text-slate-400 text-2xl font-bold">/</span> {results.totalQuestions}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-2">
              <Button
                onClick={loadQuiz}
                className="shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 py-3 bg-white"
              >
                <RefreshCw className="h-4 w-4" /> Retake Quiz
              </Button>
              <Link href="/analytics">
                <Button variant="primary" className="shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3">
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>

          {/* Review Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest px-1">
              Detailed Question Review
            </h2>

            {questions.map((q, idx) => {
              const selectedAnswer = answers[q.id] || ''
              const isCorrect = selectedAnswer.trim() === q.correctAnswer.trim()
              
              const options = [
                { key: 'A', text: q.optionA },
                { key: 'B', text: q.optionB },
                { key: 'C', text: q.optionC },
                { key: 'D', text: q.optionD }
              ]

              return (
                <Card key={q.id} className="p-6 md:p-8 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 border-2 border-slate-900 px-2.5 py-0.5">
                      Question {idx + 1}
                    </span>
                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-success uppercase tracking-wider">
                          <CheckCircle2 className="h-4.5 w-4.5" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-danger uppercase tracking-wider">
                          <XCircle className="h-4.5 w-4.5" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-black text-slate-900 leading-snug">{q.question}</p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {options.map((opt) => {
                      const isSelected = selectedAnswer === opt.text
                      const isCorrectAnswer = q.correctAnswer === opt.text

                      return (
                        <div
                          key={opt.key}
                          className={`p-3.5 border-2 text-xs font-bold flex justify-between items-center ${
                            isSelected && isCorrect
                              ? 'border-success bg-emerald-50 text-emerald-950 shadow-[2px_2px_0px_0px_#16A34A]'
                              : isSelected && !isCorrect
                                ? 'border-danger bg-rose-50 text-rose-955 shadow-[2px_2px_0px_0px_#DC2626]'
                                : isCorrectAnswer
                                  ? 'border-success bg-emerald-50/40 text-emerald-955'
                                  : 'border-slate-200 text-slate-700 bg-white'
                          }`}
                        >
                          <span className="leading-snug">{opt.key}. {opt.text}</span>
                          {isSelected && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" />}
                          {isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 text-danger shrink-0" />}
                        </div>
                      )
                    })}
                  </div>

                  {!isCorrect && (
                    <div className="p-4 border-2 border-slate-900 bg-slate-50 text-xs font-semibold text-slate-700 leading-relaxed">
                      <span className="font-black text-slate-900 uppercase text-[9px] tracking-wider block mb-1">AI Solution Key:</span>
                      {q.correctAnswer}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Quiz Taking UI
  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion.id] || ''

  const currentOptions = [
    { key: 'A', text: currentQuestion.optionA },
    { key: 'B', text: currentQuestion.optionB },
    { key: 'C', text: currentQuestion.optionC },
    { key: 'D', text: currentQuestion.optionD }
  ]

  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        {/* Timer & Headers */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 border-2 border-slate-900 text-rose-600 shadow-[1px_1px_0px_0px_#0F172A]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
                Comprehension Quiz
              </h1>
              <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider mt-0.5">
                Topic ID: #{topicId}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2.5 px-4 py-2 border-2 border-slate-900 bg-white font-mono text-xs font-black shadow-[3px_3px_0px_0px_#0F172A]">
            <Timer className={`h-4.5 w-4.5 ${timeLeft < 60 ? 'text-danger animate-pulse' : 'text-slate-600'}`} />
            <span className={timeLeft < 60 ? 'text-danger' : 'text-slate-900'}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white h-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <div
            className="bg-rose-600 h-full transition-all duration-350 border-r-2 border-slate-900"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Panel */}
        <Card className="p-8 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase text-rose-600 tracking-widest bg-rose-50 border-2 border-rose-900 px-2.5 py-0.5">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {currentQuestion.question}
          </p>

          <div className="grid gap-3 pt-2">
            {currentOptions.map((opt) => {
              const isSelected = selectedAnswer === opt.text

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.text)}
                  className={`w-full text-left p-4 border-2 text-xs font-bold flex items-center gap-4 transition-all duration-100 ${
                    isSelected
                      ? 'border-primary bg-blue-50 text-slate-900 shadow-[3px_3px_0px_0px_#2563EB] translate-x-[-1px] translate-y-[-1px]'
                      : 'border-slate-205 bg-white text-slate-700 hover:border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`h-6 w-6 shrink-0 border-2 flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'border-primary bg-primary text-white font-black'
                        : 'border-slate-900 text-slate-900 bg-white'
                    } shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]`}
                  >
                    {opt.key}
                  </span>
                  <span className="leading-snug">{opt.text}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Step Navigation Controls */}
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex-1 justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3 bg-white"
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={() => handleSubmit(false)}
              variant="primary"
              className="flex-1 justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3"
              isLoading={submitting}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex-1 justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3 bg-white"
            >
              Next <ArrowRight className="h-4.5 w-4.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
