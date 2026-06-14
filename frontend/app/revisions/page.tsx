'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'
import { revisionService } from '@/services/revision.service'
import type { Revision } from '@/types'
import {
  BookOpen,
  Copy,
  Eye,
  X,
  Clock,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

export default function RevisionPage() {
  const { showToast } = useToast()
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRevision, setActiveRevision] = useState<Revision | null>(null)

  const loadRevisions = async () => {
    try {
      const data = await revisionService.getRevisions()
      setRevisions(data)
    } catch {
      showToast('Failed to load revision notes', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRevisions()
  }, [])

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    showToast('Revision notes copied!', 'success')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              Revision Summaries
            </h1>
            <p className="text-sm text-slate-500 font-black uppercase tracking-wider mt-1.5">
              Consolidated quick study sheets and summary guides
            </p>
          </div>
        </div>

        {/* Revisions Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : revisions.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A]">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xs font-black uppercase text-slate-700">No revision notes compiled</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
              Generate notes and click "Save Summary" from your topics list to populate this hub.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {revisions.map((rev) => (
              <Card
                key={rev.id}
                className="flex flex-col justify-between h-56 shadow-[4px_4px_0px_0px_#0F172A] border-2 border-slate-900 hover:shadow-[6px_6px_0px_0px_#0F172A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 border-2 border-slate-900 px-2 py-0.5 shadow-[1px_1px_0px_0px_#0F172A]">
                      Topic #{rev.topicId}
                    </span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider line-clamp-1">
                    Summary ID #{rev.id}
                  </h3>
                  <p className="text-xs text-slate-650 line-clamp-3 leading-relaxed font-semibold">
                    {rev.content}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <Button
                    onClick={() => setActiveRevision(rev)}
                    variant="primary"
                    size="sm"
                    className="flex-1 text-[10px] py-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Quick Review
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(rev.content)}
                    size="sm"
                    className="p-2 bg-slate-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center border-2 border-slate-900"
                    title="Copy Text"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={`/notes/${rev.topicId}`}>
                    <Button
                      size="sm"
                      className="p-2 bg-slate-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center border-2 border-slate-900"
                      title="View Full Notes"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Review Modal */}
        {activeRevision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setActiveRevision(null)}
            />
            <Card className="relative w-full max-w-2xl bg-white max-h-[80vh] flex flex-col p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] z-10 border-2 border-slate-900">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
                <div>
                  <Badge variant="primary">Topic #{activeRevision.topicId}</Badge>
                  <h2 className="text-xl font-black uppercase text-slate-950 tracking-tight mt-2.5">
                    Revision notes preview
                  </h2>
                </div>
                <button
                  onClick={() => setActiveRevision(null)}
                  className="p-1.5 border-2 border-slate-900 bg-white hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
                <MarkdownRenderer content={activeRevision.content} />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end mt-4 border-t border-slate-100 pt-4">
                <Button
                  onClick={() => copyToClipboard(activeRevision.content)}
                  className="shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] py-2.5 bg-white text-xs"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy text
                </Button>
                <Button
                  onClick={() => setActiveRevision(null)}
                  variant="primary"
                  className="shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] py-2.5 text-xs"
                >
                  Close Review
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
