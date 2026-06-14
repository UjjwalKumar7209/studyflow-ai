'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { documentService } from '@/services/document.service'
import { noteService } from '@/services/note.service'
import { flashcardService } from '@/services/flashcard.service'
import { quizService } from '@/services/quiz.service'
import { revisionService } from '@/services/revision.service'
import type { Document, Topic } from '@/types'
import {
  ArrowLeft,
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  Activity,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function TopicsPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const documentId = Number(params.id)

  const [document, setDocument] = useState<Document | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const loadTopics = async () => {
    try {
      const [doc, topicsList] = await Promise.all([
        documentService.getDocument(documentId),
        documentService.getTopics(documentId)
      ])
      setDocument(doc)
      setTopics(topicsList)
    } catch {
      showToast('Document not found', 'error')
      router.push('/documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) {
      loadTopics()
    }
  }, [documentId])

  const setActionState = (topicId: number, action: string, state: boolean) => {
    setActionLoading((prev) => ({
      ...prev,
      [`${topicId}-${action}`]: state
    }))
  }

  const handleNotesAction = async (topicId: number) => {
    setActionState(topicId, 'notes', true)
    try {
      const existing = await noteService.getNotes(topicId)
      if (existing) {
        router.push(`/notes/${topicId}`)
      } else {
        showToast('Generating AI Notes for topic...', 'info')
        await noteService.generateNotes(topicId)
        showToast('AI Notes generated successfully!', 'success')
        router.push(`/notes/${topicId}`)
      }
    } catch {
      try {
        showToast('Generating AI Notes for topic...', 'info')
        await noteService.generateNotes(topicId)
        showToast('AI Notes generated successfully!', 'success')
        router.push(`/notes/${topicId}`)
      } catch {
        showToast('Failed to generate notes', 'error')
      }
    } finally {
      setActionState(topicId, 'notes', false)
    }
  }

  const handleFlashcardsAction = async (topicId: number) => {
    setActionState(topicId, 'flashcards', true)
    try {
      const existing = await flashcardService.getFlashcards(topicId)
      if (existing && existing.length > 0) {
        router.push(`/flashcards/${topicId}`)
      } else {
        showToast('Generating AI Flashcards for topic...', 'info')
        await flashcardService.generateFlashcards(topicId)
        showToast('AI Flashcards generated successfully!', 'success')
        router.push(`/flashcards/${topicId}`)
      }
    } catch {
      try {
        showToast('Generating AI Flashcards for topic...', 'info')
        await flashcardService.generateFlashcards(topicId)
        showToast('AI Flashcards generated successfully!', 'success')
        router.push(`/flashcards/${topicId}`)
      } catch {
        showToast('Failed to generate flashcards', 'error')
      }
    } finally {
      setActionState(topicId, 'flashcards', false)
    }
  }

  const handleQuizAction = async (topicId: number) => {
    setActionState(topicId, 'quiz', true)
    try {
      const existing = await quizService.getQuiz(topicId)
      if (existing && existing.length > 0) {
        router.push(`/quiz/${topicId}`)
      } else {
        showToast('Generating AI Comprehension Quiz...', 'info')
        await quizService.generateQuiz(topicId)
        showToast('AI Quiz generated successfully!', 'success')
        router.push(`/quiz/${topicId}`)
      }
    } catch {
      try {
        showToast('Generating AI Comprehension Quiz...', 'info')
        await quizService.generateQuiz(topicId)
        showToast('AI Quiz generated successfully!', 'success')
        router.push(`/quiz/${topicId}`)
      } catch {
        showToast('Failed to generate quiz', 'error')
      }
    } finally {
      setActionState(topicId, 'quiz', false)
    }
  }

  const handleRevisionAction = async (topicId: number) => {
    setActionState(topicId, 'revision', true)
    try {
      showToast('Generating consolidated revision sheet...', 'info')
      await revisionService.generateRevision(topicId)
      showToast('Revision sheet saved! Check it in the Revision Notes hub.', 'success')
      router.push('/revisions')
    } catch (error: any) {
      showToast(error.response?.data?.msg || 'Notes must be generated first before creating revision summaries', 'error')
    } finally {
      setActionState(topicId, 'revision', false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!document) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Link */}
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Documents
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 border-2 border-slate-900 text-primary shadow-[2px_2px_0px_0px_#0F172A]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
                Extracted Syllabus Topics
              </h1>
              <p className="text-xs text-slate-550 font-bold uppercase tracking-wider mt-1.5 truncate max-w-sm md:max-w-xl">
                Source Document: {document.title}
              </p>
            </div>
          </div>
          <Link href={`/chat/${document.id}`} className="w-full md:w-auto shrink-0">
            <Button className="w-full md:w-auto shadow-[3px_3px_0px_0px_#0F172A] bg-white">
              Chat With Document
            </Button>
          </Link>
        </div>

        {/* Topics List Grid */}
        {topics.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A]">
            <Activity className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xs font-black uppercase text-slate-700">No topics extracted</h3>
            <p className="text-[10px] text-slate-500 mt-1.5 uppercase font-bold tracking-wider">
              Return to the documents workspace and parse the PDF to load extracted chapters.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <Card
                key={topic.id}
                className="p-6 md:p-8 shadow-[4px_4px_0px_0px_#0F172A] border-2 border-slate-900 hover:shadow-[6px_6px_0px_0px_#0F172A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 border-2 border-slate-900 px-2.5 py-0.5 shadow-[1px_1px_0px_0px_#0F172A] w-fit">
                    Topic #{index + 1}
                  </span>
                  <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight mt-4.5">
                    {topic.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8 border-t border-slate-100 pt-6">
                  {/* Action 1: AI Notes */}
                  <Button
                    onClick={() => handleNotesAction(topic.id)}
                    size="sm"
                    className="w-full shadow-[2px_2px_0px_0px_#0F172A] bg-white text-slate-900"
                    isLoading={actionLoading[`${topic.id}-notes`]}
                  >
                    <BookOpen className="h-4 w-4 mr-1.5 text-emerald-600 shrink-0" /> Study Notes
                  </Button>

                  {/* Action 2: AI Flashcards */}
                  <Button
                    onClick={() => handleFlashcardsAction(topic.id)}
                    size="sm"
                    className="w-full shadow-[2px_2px_0px_0px_#0F172A] bg-white text-slate-900"
                    isLoading={actionLoading[`${topic.id}-flashcards`]}
                  >
                    <Layers className="h-4 w-4 mr-1.5 text-indigo-650 shrink-0" /> Flashcards
                  </Button>

                  {/* Action 3: AI Quizzes */}
                  <Button
                    onClick={() => handleQuizAction(topic.id)}
                    size="sm"
                    className="w-full shadow-[2px_2px_0px_0px_#0F172A] bg-white text-slate-900"
                    isLoading={actionLoading[`${topic.id}-quiz`]}
                  >
                    <HelpCircle className="h-4 w-4 mr-1.5 text-danger shrink-0" /> Take Quiz
                  </Button>

                  {/* Action 4: AI Revisions summary */}
                  <Button
                    onClick={() => handleRevisionAction(topic.id)}
                    size="sm"
                    className="w-full shadow-[2px_2px_0px_0px_#0F172A] bg-slate-50 text-slate-905"
                    isLoading={actionLoading[`${topic.id}-revision`]}
                  >
                    <Sparkles className="h-4 w-4 mr-1.5 text-warning shrink-0" /> Save Summary
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
