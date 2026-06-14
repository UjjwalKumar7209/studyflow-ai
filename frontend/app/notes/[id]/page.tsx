'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { noteService } from '@/services/note.service'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import type { Note } from '@/types'
import {
  ArrowLeft,
  Copy,
  Download,
  BookOpen,
  FileText,
  Clock,
  Printer
} from 'lucide-react'

export default function NotesPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const topicId = Number(params.id)

  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await noteService.getNotes(topicId)
        if (!data) {
          showToast('Notes not generated for this topic yet', 'info')
          router.back()
          return
        }
        setNote(data)
      } catch (err) {
        showToast('Failed to load study notes', 'error')
        router.back()
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadNotes()
    }
  }, [topicId])

  const copyToClipboard = () => {
    if (!note) return
    navigator.clipboard.writeText(note.content)
    showToast('Notes copied to clipboard!', 'success')
  }

  const exportAsText = () => {
    if (!note) return
    const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `StudyFlow_Notes_Topic_${topicId}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Downloaded notes as text file!', 'success')
  }

  const printNotes = () => {
    window.print()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-3 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-40 col-span-1" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!note) return null

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-4 print:p-0">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors print:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-6 print:border-b print:pb-3">
          <div className="p-3 bg-emerald-50 border-2 border-slate-900 text-emerald-600 shadow-[2px_2px_0px_0px_#0F172A] print:shadow-none print:border">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
              Study Notes
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
              <span>Topic ID: #{note.topicId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Updated {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Notes Workspace */}
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Main Reading area */}
          <div className="lg:col-span-3 bg-white border-2 border-slate-900 p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] print:shadow-none print:border-none print:p-0">
            <article className="max-w-3xl mx-auto">
              <MarkdownRenderer content={note.content} />
            </article>
          </div>

          {/* Sticky Tools Sidebar */}
          <div className="lg:col-span-1 sticky top-24 space-y-6 print:hidden">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 px-1">
              <FileText className="h-4.5 w-4.5 text-slate-500" /> Actions Menu
            </h2>

            <Card className="p-4 space-y-3 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
              <Button
                onClick={copyToClipboard}
                className="w-full text-xs font-black py-3 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] justify-start bg-slate-50"
              >
                <Copy className="h-4 w-4 mr-2.5 text-slate-600" /> Copy to Clipboard
              </Button>

              <Button
                onClick={exportAsText}
                className="w-full text-xs font-black py-3 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] justify-start bg-slate-50"
              >
                <Download className="h-4 w-4 mr-2.5 text-slate-600" /> Export as Plain Text
              </Button>

              <Button
                onClick={printNotes}
                className="w-full text-xs font-black py-3 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] justify-start bg-slate-50"
              >
                <Printer className="h-4 w-4 mr-2.5 text-slate-600" /> Print Document
              </Button>
            </Card>

            <Card className="p-4 text-xs bg-slate-50 border-2 border-slate-900">
              <p className="font-black uppercase tracking-wider text-[9px] text-slate-550 mb-1.5">Study tip</p>
              <p className="font-semibold text-slate-700 leading-normal">
                Try generating a consolidated **Revision summary** from the topics page after reading this note to cement your understanding of the facts.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
