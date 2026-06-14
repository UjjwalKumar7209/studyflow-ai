'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { flashcardService } from '@/services/flashcard.service'
import type { Flashcard } from '@/types'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Layers,
  HelpCircle
} from 'lucide-react'

export default function FlashcardsPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const topicId = Number(params.id)

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    async function loadFlashcards() {
      try {
        const data = await flashcardService.getFlashcards(topicId)
        if (!data || data.length === 0) {
          showToast('No flashcards found for this topic', 'info')
          router.back()
          return
        }
        setFlashcards(data)
      } catch {
        showToast('Failed to load flashcards', 'error')
        router.back()
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadFlashcards()
    }
  }, [topicId])

  // Keyboard navigation controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || flashcards.length === 0) return

      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped((prev) => !prev)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [loading, flashcards, currentIndex])

  const handleNext = () => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150)
  }

  const handlePrev = () => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
        </div>
      </DashboardLayout>
    )
  }

  if (flashcards.length === 0) return null

  const currentCard = flashcards[currentIndex]
  const progressPercent = Math.round(((currentIndex + 1) / flashcards.length) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        {/* Title & Stats */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border-2 border-slate-900 text-indigo-650 shadow-[1px_1px_0px_0px_#0F172A]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
                Flashcard Decks
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Topic ID: #{topicId}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase text-slate-905 tracking-widest">
              Card {currentIndex + 1} of {flashcards.length}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
              {progressPercent}% Complete
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white h-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 border-r-2 border-slate-900"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Interactive 3D Flip Card Container */}
        <div
          className="w-full h-96 relative cursor-pointer select-none perspective-1000"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`w-full h-full absolute inset-0 flashcard-inner ${
              flipped ? 'flashcard-flipped' : ''
            }`}
          >
            {/* Front Card Face (Question) */}
            <div className="w-full h-full absolute inset-0 flashcard-face bg-white border-4 border-slate-900 p-10 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 border-2 border-indigo-200 px-2.5 py-0.5 w-fit">
                Question
              </span>
              <div className="flex-1 flex items-center justify-center text-center px-4">
                <p className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                  {currentCard.question}
                </p>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-black text-slate-900"><RotateCw className="h-4 w-4" /> CLICK TO REVEAL ANSWER</span>
                <span>Spacebar</span>
              </div>
            </div>

            {/* Back Card Face (Answer) */}
            <div className="w-full h-full absolute inset-0 flashcard-face flashcard-back bg-indigo-50 border-4 border-slate-900 p-10 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-[9px] font-black uppercase text-white tracking-widest bg-slate-900 border-2 border-slate-900 px-2.5 py-0.5 w-fit">
                Answer Summary
              </span>
              <div className="flex-1 flex items-center justify-center text-center px-4 overflow-y-auto">
                <p className="text-base md:text-lg font-extrabold text-slate-900 leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
              <div className="flex justify-between items-center text-indigo-600/80 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-black text-indigo-850"><RotateCw className="h-4 w-4" /> CLICK TO VIEW QUESTION</span>
                <span>Spacebar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deck Navigation Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrev}
            className="flex-1 justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3 bg-white"
          >
            <ChevronLeft className="h-4.5 w-4.5 mr-1.5" /> Previous Card
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-3 bg-white"
          >
            Next Card <ChevronRight className="h-4.5 w-4.5 ml-1.5" />
          </Button>
        </div>

        {/* Keyboard Helper Box */}
        <Card className="p-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-2 border-slate-900 flex justify-around shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="flex items-center gap-1.5 text-slate-900"><HelpCircle className="h-4 w-4 text-slate-650" /> shortcuts Binds:</span>
          <span>[Space] Flip Card</span>
          <span>[←] Prev</span>
          <span>[→] Next</span>
        </Card>
      </div>
    </DashboardLayout>
  )
}
